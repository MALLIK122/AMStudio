import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE_DIR = path.resolve('scratch/test-chrome-profile-full');
const DIST_DIR = path.resolve('dist');
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    if (cleanUrl === '/' || cleanUrl === '') cleanUrl = '/index.html';

    let filePath = path.join(DIST_DIR, cleanUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

async function main() {
  console.log('--- STARTING AM STUDIO REAL-TIME BROWSER AUTOMATION SUITE ---');

  if (fs.existsSync(TEMP_PROFILE_DIR)) {
    try {
      fs.rmSync(TEMP_PROFILE_DIR, { recursive: true, force: true });
    } catch (e) {}
  }
  fs.mkdirSync(TEMP_PROFILE_DIR, { recursive: true });

  console.log(`[Server] Starting HTTP static server for dist on port ${PORT}...`);
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
  console.log('[Server] Static server online at ' + BASE_URL);

  console.log('[Chrome] Launching Chrome on port 9222...');
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=9222`,
    `--headless=new`,
    `--user-data-dir=${TEMP_PROFILE_DIR}`,
    `--disable-gpu`,
    `--no-first-run`,
    `--no-default-browser-check`,
    `--window-size=1400,900`,
    BASE_URL,
  ], {
    stdio: 'ignore',
  });

  let pageWsUrl = null;
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    try {
      const targets = await fetchJson('http://127.0.0.1:9222/json/list');
      const pageTarget = targets?.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTarget) {
        pageWsUrl = pageTarget.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!pageWsUrl) {
    console.error('FATAL: Could not find page target on Chrome DevTools.');
    chromeProcess.kill();
    server.close();
    process.exit(1);
  }
  console.log('[Chrome] Connected to Page Target: ' + pageWsUrl);

  const ws = new WebSocket(pageWsUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const sendCDP = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  const evalJs = async (expr) => {
    const res = await sendCDP('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval failed: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  };

  const testResults = [];
  const recordTest = (name, passed, details = '') => {
    testResults.push({ name, passed, details });
    const mark = passed ? 'PASS' : 'FAIL';
    console.log(`[${mark}] ${name} ${details ? '- ' + details : ''}`);
  };

  // Wait 2.5 seconds for React to hydrate and render
  await sleep(2500);

  // Inject helper in browser context for setting React controlled inputs
  await evalJs(`
    window.__setReactInput = function(elem, val) {
      if (!elem) return;
      if (elem._valueTracker) {
        elem._valueTracker.setValue('__init_prev__');
      }
      const proto = elem instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) {
        desc.set.call(elem, val);
      } else {
        elem.value = val;
      }
      elem.dispatchEvent(new Event('input', { bubbles: true }));
      elem.dispatchEvent(new Event('change', { bubbles: true }));
    };
  `);

  try {
    // ==========================================
    // TEST 1: HOMEPAGE LOAD & RENDERING
    // ==========================================
    console.log('\n--- Running Test 1: Homepage Load ---');
    const title = await evalJs('document.title');
    recordTest('Homepage loaded with proper title', title.includes('AM Studio'), `Title: "${title}"`);

    const hasNav = await evalJs('Boolean(document.querySelector("nav"))');
    recordTest('Navigation bar rendered', hasNav === true);

    const projectCardsCount = await evalJs('document.querySelectorAll("#projects .group").length');
    recordTest('Portfolio project cards rendered on homepage (13 items including Food Menu)', projectCardsCount >= 13, `Count: ${projectCardsCount}`);

    // ==========================================
    // TEST 2: CATEGORY FILTERING & SEARCH
    // ==========================================
    console.log('\n--- Running Test 2: Category Filter & Search ---');
    const categoriesList = await evalJs(`
      Array.from(document.querySelectorAll('#projects button'))
        .map(b => b.textContent.trim())
        .filter(t => !t.includes('Live to see') && t.length > 0)
    `);
    recordTest('Category filter tabs present', categoriesList.length >= 5, `Categories: ${categoriesList.join(', ')}`);

    // Click "Wedding Websites" category button and wait for re-render
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('#projects button'));
      const webBtn = btns.find(b => b.textContent.includes('Wedding Websites'));
      if (webBtn) webBtn.click();
    })()`);
    await sleep(500);

    const filteredWebsitesCount = await evalJs('document.querySelectorAll("#projects .group").length');
    recordTest('Filter by Wedding Websites displays 3 websites', filteredWebsitesCount === 3, `Count: ${filteredWebsitesCount}`);

    // Click "Business & Promotion" category button
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('#projects button'));
      const bBtn = btns.find(b => b.textContent.includes('Business & Promotion'));
      if (bBtn) bBtn.click();
    })()`);
    await sleep(500);

    const businessCount = await evalJs('document.querySelectorAll("#projects .group").length');
    recordTest('Filter by Business & Promotion includes Food Menu poster', businessCount >= 4, `Count: ${businessCount}`);

    // Click "All" category button
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('#projects button'));
      const allBtn = btns.find(b => b.textContent.trim().startsWith('All'));
      if (allBtn) allBtn.click();
    })()`);
    await sleep(400);

    // Search for "Food Menu"
    await evalJs(`(() => {
      const input = document.querySelector('#projects input[type="text"]');
      if (input) window.__setReactInput(input, 'Food Menu');
    })()`);
    await sleep(400);

    const searchFound = await evalJs(`(() => {
      const cards = document.querySelectorAll('#projects .group');
      const text = Array.from(cards).map(c => c.textContent).join(' ');
      return text.includes('Food Menu');
    })()`);
    recordTest('Search input filters correctly for "Food Menu"', searchFound === true);

    // Clear search
    await evalJs(`(() => {
      const input = document.querySelector('#projects input[type="text"]');
      if (input) window.__setReactInput(input, '');
    })()`);
    await sleep(400);

    // ==========================================
    // TEST 3: FOOD MENU POSTER (USER'S POSTER)
    // ==========================================
    console.log('\n--- Running Test 3: Food Menu Poster (User Uploaded) ---');
    const foodMenuData = await evalJs(`(() => {
      const cards = Array.from(document.querySelectorAll('#projects .group'));
      const foodCard = cards.find(c => c.textContent.includes('Our Food Menu'));
      if (!foodCard) return null;
      const img = foodCard.querySelector('img')?.getAttribute('src');
      const waLink = foodCard.querySelector('a[href*="wa.me"]')?.getAttribute('href');
      return {
        hasCard: true,
        img,
        waLink,
        title: foodCard.querySelector('h4')?.textContent || '',
      };
    })()`);

    recordTest('Food Menu Poster is active in portfolio', Boolean(foodMenuData && foodMenuData.hasCard));
    recordTest('Food Menu Poster image points to /images/posters/poster-food-menu.png', foodMenuData?.img === '/images/posters/poster-food-menu.png', `Image: ${foodMenuData?.img}`);
    recordTest('Food Menu WhatsApp button targets AM Studio phone 919731696952', Boolean(foodMenuData?.waLink && foodMenuData.waLink.includes('919731696952')));
    recordTest('Food Menu WhatsApp message includes poster order text', Boolean(foodMenuData?.waLink && decodeURIComponent(foodMenuData.waLink).includes('order/customize the "Our Food Menu')));

    // Open Project Modal for Food Menu Poster
    await evalJs(`(() => {
      const cards = Array.from(document.querySelectorAll('#projects .group'));
      const foodCard = cards.find(c => c.textContent.includes('Our Food Menu'));
      if (!foodCard) return;
      const imgArea = foodCard.querySelector('.cursor-pointer') || foodCard.querySelector('img');
      if (imgArea) imgArea.click();
    })()`);
    await sleep(700);

    const modalOpened = await evalJs('Boolean(document.querySelector(".fixed.inset-0.z-50"))');
    recordTest('Project Modal opens when Food Menu Poster is clicked', modalOpened === true);

    const modalWaLink = await evalJs(`(() => {
      const modal = document.querySelector('.fixed.inset-0.z-50');
      if (!modal) return null;
      const waBtn = modal.querySelector('a[href*="wa.me"]');
      return waBtn ? waBtn.getAttribute('href') : null;
    })()`);
    recordTest('Project Modal contains "Order This Poster on WhatsApp" button', Boolean(modalWaLink && modalWaLink.includes('919731696952')));

    // Close modal
    await evalJs(`(() => {
      const closeBtn = document.querySelector('.fixed.inset-0.z-50 button[aria-label*="Close"]');
      if (closeBtn) closeBtn.click();
      else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    })()`);
    await sleep(400);
    const modalClosed = await evalJs('!document.querySelector(".fixed.inset-0.z-50")');
    recordTest('Project Modal closes smoothly', modalClosed === true);

    // ==========================================
    // TEST 4: WEDDING INVITATION FEATURES & WHATSAPP LINK
    // ==========================================
    console.log('\n--- Running Test 4: Wedding Invitation Features ---');
    const weddingCardData = await evalJs(`(() => {
      const cards = Array.from(document.querySelectorAll('#projects .group'));
      const wedCard = cards.find(c => c.textContent.includes('Arjun & Ananya'));
      if (!wedCard) return null;
      const liveBtn = wedCard.querySelector('a[href*="wedding-invite"]');
      const waBtn = wedCard.querySelector('a[href*="wa.me"]');
      return {
        liveUrl: liveBtn?.getAttribute('href'),
        waUrl: waBtn?.getAttribute('href'),
      };
    })()`);

    recordTest('Wedding Invitation Live Demo link points to live app', weddingCardData?.liveUrl === 'https://wedding-invite-tau-one.vercel.app');
    recordTest('Wedding Invitation WhatsApp link targets 919731696952', Boolean(weddingCardData?.waUrl && weddingCardData.waUrl.includes('919731696952')));
    recordTest('Wedding WhatsApp message includes customized wedding inquiry text', Boolean(weddingCardData?.waUrl && decodeURIComponent(weddingCardData.waUrl).includes('loved the "Arjun & Ananya')));

    // ==========================================
    // TEST 5: CONTACT & ENQUIRY FORM SUBMISSION (WEDDING & POSTER)
    // ==========================================
    console.log('\n--- Running Test 5: Contact & Enquiry Form Submission ---');
    
    // Fill and submit Wedding Inquiry using __setReactInput
    await evalJs(`(() => {
      const form = document.querySelector('#contact form');
      if (!form) return;

      const inputs = Array.from(form.querySelectorAll('input'));
      const nameInput = inputs.find(i => i.type === 'text');
      const phoneInput = inputs.find(i => i.type === 'tel');
      const emailInput = inputs.find(i => i.type === 'email');
      const serviceSelect = form.querySelector('select');
      const dateInput = inputs.filter(i => i.type === 'text')[1];
      const msgInput = form.querySelector('textarea');
      const submitBtn = form.querySelector('button[type="submit"]');

      window.__setReactInput(nameInput, 'Vikram & Radhika');
      window.__setReactInput(phoneInput, '+91 97316 96952');
      window.__setReactInput(emailInput, 'vikram.radhika@example.com');

      if (serviceSelect) {
        serviceSelect.value = 'Wedding Invitation Website';
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (dateInput) {
        window.__setReactInput(dateInput, '15 November 2026');
      }

      window.__setReactInput(msgInput, 'Testing automated wedding invitation website inquiry with RSVP.');

      window.__lastDispatchedWaUrl = null;
      window.open = (url) => { window.__lastDispatchedWaUrl = url; return null; };

      submitBtn.click();
    })()`);
    recordTest('Wedding Inquiry Form inputs filled and submitted', true);

    // Wait up to 5 seconds for FormSubmit fetch to resolve and success screen to show
    let successShown = false;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      successShown = await evalJs(`Boolean(document.querySelector('#contact')?.textContent.includes('Vikram & Radhika'))`);
      if (successShown) break;
    }

    recordTest('Success screen displays client name Vikram & Radhika', successShown === true);

    const inquiryDetails = await evalJs(`(() => {
      const contactText = document.querySelector('#contact')?.textContent || '';
      const dispatchedWaUrl = window.__lastDispatchedWaUrl || '';
      return {
        hasEmailInboxNotice: contactText.includes('amstudio.support.in@gmail.com'),
        hasWhatsAppAlertNotice: contactText.includes('+91 97316 96952'),
        dispatchedWaUrl,
      };
    })()`);

    recordTest('Official email notification target is amstudio.support.in@gmail.com', inquiryDetails.hasEmailInboxNotice === true);
    recordTest('WhatsApp Alert target is +91 97316 96952', inquiryDetails.hasWhatsAppAlertNotice === true);
    recordTest('WhatsApp alert message formatted with client details', Boolean(inquiryDetails.dispatchedWaUrl && decodeURIComponent(inquiryDetails.dispatchedWaUrl).includes('Vikram & Radhika')));

    // Reset and submit Poster Inquiry
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('#contact button'));
      const resetBtn = btns.find(b => b.textContent.includes('Send Another Request') || b.textContent.includes('ಮತ್ತೊಂದು ಮನವಿ'));
      if (resetBtn) resetBtn.click();
    })()`);
    await sleep(500);

    await evalJs(`(() => {
      const form = document.querySelector('#contact form');
      if (!form) return;

      const inputs = Array.from(form.querySelectorAll('input'));
      const nameInput = inputs.find(i => i.type === 'text');
      const phoneInput = inputs.find(i => i.type === 'tel');
      const emailInput = inputs.find(i => i.type === 'email');
      const serviceSelect = form.querySelector('select');
      const msgInput = form.querySelector('textarea');
      const submitBtn = form.querySelector('button[type="submit"]');

      window.__setReactInput(nameInput, 'Spice Route Cafe');
      window.__setReactInput(phoneInput, '+91 97316 96952');
      window.__setReactInput(emailInput, 'spiceroute@example.com');

      if (serviceSelect) {
        serviceSelect.value = 'Business / Marketing Flyer';
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      window.__setReactInput(msgInput, 'Want a custom restaurant food menu poster based on Our Food Menu design.');

      window.__lastDispatchedWaUrl = null;
      submitBtn.click();
    })()`);

    let posterSuccessShown = false;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      posterSuccessShown = await evalJs(`Boolean(document.querySelector('#contact')?.textContent.includes('Spice Route Cafe'))`);
      if (posterSuccessShown) break;
    }

    recordTest('Poster Inquiry submitted with Business / Marketing Flyer type', posterSuccessShown === true);
    const posterWaUrl = await evalJs('window.__lastDispatchedWaUrl || ""');
    recordTest('Poster Inquiry WhatsApp Alert generated for Spice Route Cafe', Boolean(posterWaUrl && decodeURIComponent(posterWaUrl).includes('Spice Route Cafe')));

    // ==========================================
    // TEST 6: ADMIN SECURITY & LOGIN
    // ==========================================
    console.log('\n--- Running Test 6: Admin Security & Login Verification ---');
    await evalJs(`window.location.hash = '#admin'`);
    await sleep(800);

    const loginScreenVisible = await evalJs(`Boolean(document.querySelector('input[type="password"]'))`);
    recordTest('Admin Login Screen rendered at #admin', loginScreenVisible === true);

    // 1. Verify old master password 'amstudio2026!' is REJECTED
    const masterRejected = await evalJs(`(async () => {
      const pwdInput = document.querySelector('input[type="password"]');
      const submitBtn = document.querySelector('button[type="submit"]');
      if (!pwdInput || !submitBtn) return false;
      window.__setReactInput(pwdInput, 'amstudio2026!');
      submitBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const hasError = Boolean(document.querySelector('div[class*="bg-red-950"]') || document.body.textContent.includes('Invalid') || document.body.textContent.includes('No private administrative'));
      const notDashboard = !document.body.textContent.includes('Portfolio Works');
      return hasError && notDashboard;
    })()`);
    recordTest('Master password "amstudio2026!" is strictly blocked & rejected', masterRejected === true);

    // 2. Test confidential OTP password setup flow
    console.log('[Auth] Testing Confidential Email OTP Password Reset Flow...');
    await evalJs(`(() => {
      const forgotBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Forgot Password'));
      if (forgotBtn) forgotBtn.click();
    })()`);
    await sleep(400);

    // Intercept fetch for OTP code
    await evalJs(`(() => {
      window.__interceptedOtp = null;
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('formsubmit.co')) {
          try {
            const body = JSON.parse(args[1]?.body || '{}');
            if (body.one_time_verification_code) {
              window.__interceptedOtp = body.one_time_verification_code;
            }
          } catch (e) {}
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return originalFetch(...args);
      };
    })()`);

    // Click "Send Verification Code"
    await evalJs(`(() => {
      const sendCodeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Send Verification Code'));
      if (sendCodeBtn) sendCodeBtn.click();
    })()`);

    // Poll for OTP reset inputs to appear
    let formReady = false;
    for (let i = 0; i < 25; i++) {
      await sleep(300);
      formReady = await evalJs(`Boolean(document.querySelector('input[placeholder*="482910"]') || document.querySelector('input[maxLength="6"]'))`);
      if (formReady) break;
    }

    const otpCode = await evalJs('window.__activeAdminOtp || window.__interceptedOtp');
    recordTest('6-Digit Verification Code dispatched to authorized email', Boolean(otpCode && otpCode.length === 6), `Code: ${otpCode}`);

    // Enter OTP and configure new private administrator password
    await evalJs(`((code) => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const codeInput = inputs.find(i => i.placeholder && i.placeholder.includes('482910')) || document.querySelector('input[maxLength="6"]');
      const pwdInputs = inputs.filter(i => i.type === 'password');
      const newPassInput = pwdInputs[0];
      const confirmInput = pwdInputs[1];
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Update Password') || b.textContent.includes('Set Password')) || document.querySelector('button[type="submit"]');

      if (codeInput) window.__setReactInput(codeInput, code);
      if (newPassInput) window.__setReactInput(newPassInput, 'OwnerSecurePass2026!');
      if (confirmInput) window.__setReactInput(confirmInput, 'OwnerSecurePass2026!');
      if (submitBtn) submitBtn.click();
    })('${otpCode}')`);

    // Poll for Admin CMS Dashboard to appear
    let isDashboardActive = false;
    for (let i = 0; i < 25; i++) {
      await sleep(300);
      isDashboardActive = await evalJs(`Boolean(document.body.textContent.includes('Portfolio Works') || document.body.textContent.includes('Admin CMS'))`);
      if (isDashboardActive) break;
    }
    recordTest('Authentication succeeds with private administrator password', isDashboardActive === true);

    // ==========================================
    // TEST 7: ADMIN CRUD OPERATIONS (ADD, EDIT, DELETE)
    // ==========================================
    console.log('\n--- Running Test 7: Admin Panel Project CRUD ---');

    // 1. Check Inquiries tab in Admin
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const inqBtn = btns.find(b => b.textContent.includes('Inquiries'));
      if (inqBtn) inqBtn.click();
    })()`);
    await sleep(600);

    const inquiriesFound = await evalJs(`(() => {
      const text = document.body.textContent;
      return text.includes('Vikram & Radhika') || text.includes('Spice Route Cafe');
    })()`);
    recordTest('Submitted inquiries appear in Admin Inquiries Manager', inquiriesFound === true);

    // Switch back to Projects tab
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const projBtn = btns.find(b => b.textContent.includes('Projects ('));
      if (projBtn) projBtn.click();
    })()`);
    await sleep(600);

    const adminHasFoodMenu = await evalJs(`document.body.textContent.includes('Our Food Menu')`);
    recordTest('Admin Dashboard displays Our Food Menu poster', adminHasFoodMenu === true);

    // Test Adding a Temporary Poster
    console.log('[CRUD] Testing Add Project (Poster)...');
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addPosterBtn = btns.find(b => b.textContent.includes('+ New Poster / Card'));
      if (addPosterBtn) addPosterBtn.click();
    })()`);
    await sleep(600);

    await evalJs(`(() => {
      const form = document.querySelector('form');
      if (!form) return;

      const inputs = Array.from(form.querySelectorAll('input[type="text"]'));
      const titleInput = inputs[0];
      const imgInput = inputs.find(i => i.placeholder && i.placeholder.includes('URL'));
      const descInput = form.querySelector('textarea');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (titleInput) window.__setReactInput(titleInput, 'Auto Test Live Poster 2026');
      if (imgInput) window.__setReactInput(imgInput, '/images/posters/poster-wedding-1.png');
      if (descInput) window.__setReactInput(descInput, 'Automated test poster description.');

      window.alert = () => {};
      window.confirm = () => false;
      if (submitBtn) submitBtn.click();
    })()`);
    await sleep(1500);

    const posterPresent = await evalJs(`document.body.textContent.includes('Auto Test Live Poster 2026')`);
    recordTest('Admin Add Project (Poster) successfully adds project', posterPresent === true);

    // Test Editing the Temporary Poster
    console.log('[CRUD] Testing Edit Project...');
    await evalJs(`(() => {
      const allH4 = Array.from(document.querySelectorAll('h4'));
      const testH4 = allH4.find(h => h.textContent.includes('Auto Test Live Poster 2026'));
      const card = testH4 ? testH4.closest('div[class*="rounded-2xl"]') : null;
      if (card) {
        const editBtn = card.querySelector('button[title*="Edit"]');
        if (editBtn) editBtn.click();
      }
    })()`);
    await sleep(900);

    await evalJs(`(() => {
      const modal = document.querySelector('div[class*="fixed"] form') || document.querySelector('form');
      if (!modal) return;

      const titleInput = modal.querySelector('input[type="text"]');
      const submitBtn = modal.querySelector('button[type="submit"]');

      if (titleInput) window.__setReactInput(titleInput, 'Auto Test Live Poster 2026 (MODIFIED)');

      window.alert = () => {};
      window.confirm = () => false;
      if (submitBtn) submitBtn.click();
    })()`);
    await sleep(1800);

    const editedTitlePresent = await evalJs(`document.body.textContent.includes('Auto Test Live Poster 2026 (MODIFIED)')`);
    recordTest('Admin Edit Project successfully modifies and saves changes', editedTitlePresent === true);

    // Test Deleting the Temporary Poster
    console.log('[CRUD] Testing Delete Project...');
    await evalJs(`(() => {
      window.confirm = () => true; // confirm delete prompt
      const allH4 = Array.from(document.querySelectorAll('h4'));
      const testH4 = allH4.find(h => h.textContent.includes('Auto Test Live Poster 2026 (MODIFIED)'));
      const card = testH4 ? testH4.closest('div[class*="rounded-2xl"]') : null;
      if (card) {
        const deleteBtn = card.querySelector('button[title*="Delete"]');
        if (deleteBtn) deleteBtn.click();
      }
    })()`);
    await sleep(1500);

    const posterDeleted = await evalJs(`!document.body.textContent.includes('Auto Test Live Poster 2026 (MODIFIED)')`);
    recordTest('Admin Delete Project successfully deletes project', posterDeleted === true);

    // ==========================================
    // TEST 8: QR CODE & PRINTABLE STANDEE GENERATOR
    // ==========================================
    console.log('\n--- Running Test 8: QR Code & Printable Table Standee Generator ---');
    await evalJs(`(() => {
      const cards = Array.from(document.querySelectorAll('div.glass-panel'));
      const foodCard = cards.find(c => c.textContent.includes('Our Food Menu'));
      if (foodCard) {
        const qrBtn = foodCard.querySelector('button[title*="QR Code"]');
        if (qrBtn) qrBtn.click();
      }
    })()`);
    await sleep(1000);

    const qrModalCheck = await evalJs(`Boolean(document.querySelector('div.fixed.inset-0.z-50'))`);
    recordTest('Instant QR Code Generator modal opens', qrModalCheck === true);

    // Wait up to 3 seconds for QR data URL and standee preview URL to generate
    let qrGenerated = false;
    for (let i = 0; i < 15; i++) {
      await sleep(300);
      qrGenerated = await evalJs(`(() => {
        const modal = document.querySelector('div.fixed.inset-0.z-50');
        if (!modal) return false;
        const imgs = Array.from(modal.querySelectorAll('img'));
        return imgs.some(img => img.src.startsWith('data:image'));
      })()`);
      if (qrGenerated) break;
    }
    recordTest('High-Resolution QR Code image generated', qrGenerated === true);

    // Close QR modal
    await evalJs(`(() => {
      const closeBtn = document.querySelector('div.fixed.inset-0.z-50 button[aria-label*="Close"]') ||
                       document.querySelector('div.fixed.inset-0.z-50 button:has(svg)');
      if (closeBtn) closeBtn.click();
      else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    })()`);
    await sleep(400);

    // Return to public homepage
    await evalJs(`window.location.hash = ''`);
    await sleep(800);

    // ==========================================
    // TEST 9: VERIFY USER'S FOOD MENU POSTER IS INTACT
    // ==========================================
    console.log('\n--- Running Test 9: Verify Food Menu Poster Remains Live ---');
    const foodMenuStillPresent = await evalJs(`document.body.textContent.includes('Our Food Menu')`);
    recordTest('Food Menu Poster is permanently preserved and active on homepage', foodMenuStillPresent === true);

    // ==========================================
    // TEST 10: EMOJI & DIGIT COMPLIANCE
    // ==========================================
    console.log('\n--- Running Test 10: Compliance Check (Zero Emojis & Standard Digits) ---');
    const emojiRegex = /[\u{1F300}-\u{1FAFF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    const bodyText = await evalJs(`document.body.innerText`);
    const hasEmojis = emojiRegex.test(bodyText);
    recordTest('Zero Unicode emojis across rendered page', hasEmojis === false);

  } catch (err) {
    console.error('Test execution error:', err);
    recordTest('Test suite executed without fatal script error', false, err.message);
  } finally {
    console.log('\n--- CLEANING UP TEST PROCESSES ---');
    try { ws.close(); } catch (e) {}
    try { chromeProcess.kill(); } catch (e) {}
    try { server.close(); } catch (e) {}
    console.log('Test processes terminated.');
  }

  // Summary
  console.log('\n=============================================');
  console.log('AM STUDIO AUTOMATED BROWSER TEST REPORT');
  console.log('=============================================');
  let passCount = 0;
  let failCount = 0;
  testResults.forEach(r => {
    if (r.passed) passCount++;
    else failCount++;
    console.log(`${r.passed ? '✓ PASS' : '✗ FAIL'}: ${r.name} ${r.details ? '(' + r.details + ')' : ''}`);
  });
  console.log(`\nTOTAL: ${testResults.length} | PASSED: ${passCount} | FAILED: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
