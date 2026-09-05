/**
 * GitHub & Vercel Automated Deployment Service
 * Enables the Admin CMS to commit changes directly to MALLIK122/AMStudio on GitHub,
 * which automatically triggers Vercel to rebuild and deploy live across all devices.
 */

export const GITHUB_CONFIG = {
  OWNER: 'MALLIK122',
  REPO: 'AMStudio',
  BRANCH: 'main',
  DATA_PATH: 'src/data/initialData.js',
  VERCEL_URL: 'https://am-studioma.vercel.app',
};

/**
 * Safely encode UTF-8 string to Base64 in browser
 */
export const utf8ToBase64 = (str) => {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
};

/**
 * Safely decode Base64 string to UTF-8
 */
export const base64ToUtf8 = (base64) => {
  try {
    const binary = window.atob(base64.replace(/\s/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return decodeURIComponent(escape(window.atob(base64.replace(/\s/g, ''))));
  }
};

/**
 * Generate source code string for src/data/initialData.js
 */
export const generateInitialDataFile = (projects, profile) => {
  const version = Date.now();
  return `export const DATA_VERSION = ${version};\n\nexport const INITIAL_PROJECTS = ${JSON.stringify(projects, null, 2)};\n\nexport const INITIAL_STUDIO_PROFILE = ${JSON.stringify(profile, null, 2)};\n`;
};

/**
 * Helper to fetch the latest blob SHA of src/data/initialData.js directly from GitHub.
 * Uses cache busting and no-store headers, and falls back to git tree endpoint.
 */
export const getLatestFileSha = async (token) => {
  const cleanToken = token.trim();
  const cacheBuster = Date.now();

  // 1. Try Contents API with cache-busting query param
  try {
    const contentsUrl = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_PATH}?ref=${GITHUB_CONFIG.BRANCH}&_cb=${cacheBuster}`;
    const res = await fetch(contentsUrl, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.sha) {
        return { sha: data.sha, exists: true };
      }
    } else if (res.status === 404) {
      return { sha: null, exists: false };
    }
  } catch (err) {
    console.warn('[GitHubSync] Contents API fetch failed, trying Tree API fallback:', err);
  }

  // 2. Fallback: Query Git Tree API for the branch HEAD
  try {
    const treeUrl = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/git/trees/${GITHUB_CONFIG.BRANCH}?recursive=1&_cb=${cacheBuster}`;
    const treeRes = await fetch(treeUrl, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (treeData && Array.isArray(treeData.tree)) {
        const item = treeData.tree.find((t) => t.path === GITHUB_CONFIG.DATA_PATH);
        if (item && item.sha) {
          return { sha: item.sha, exists: true };
        }
      }
    }
  } catch (err) {
    console.warn('[GitHubSync] Tree API fetch failed:', err);
  }

  return { sha: null, exists: false };
};

/**
 * Test & verify token validity and repository access
 */
export const verifyGitHubAccess = async (token) => {
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, error: 'Token is empty.' };
  }

  const cleanToken = token.trim();

  try {
    // 1. Verify user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      if (userRes.status === 401) {
        return { success: false, error: 'Invalid GitHub token. Please check and try again.' };
      }
      return { success: false, error: `GitHub API error: ${userRes.statusText}` };
    }

    const userData = await userRes.json();

    // 2. Verify repo write access
    const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!repoRes.ok) {
      return { 
        success: false, 
        error: `Cannot access repository ${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}. Make sure token has "repo" scope.` 
      };
    }

    const repoData = await repoRes.json();
    const canPush = repoData.permissions ? repoData.permissions.push : true;

    return {
      success: true,
      username: userData.login,
      repoName: repoData.full_name,
      canPush,
    };
  } catch (err) {
    return { success: false, error: err.message || 'Network error connecting to GitHub.' };
  }
};

/**
 * Push updated initialData.js directly to GitHub repository on main branch
 * Automatically detects and handles blob SHA mismatches and 409 conflicts.
 */
export const pushToGitHub = async ({ token, projects, profile, commitMessage }) => {
  if (!token || !token.trim()) {
    return {
      success: false,
      error: 'GitHub Personal Access Token is required to deploy live.',
      needsToken: true,
    };
  }

  const cleanToken = token.trim();
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_PATH}`;
  const fileCode = generateInitialDataFile(projects, profile);
  const contentBase64 = utf8ToBase64(fileCode);
  const defaultMsg = `chore(cms): update wedding invitation projects from admin dashboard [${new Date().toLocaleTimeString('en-US')}]`;

  // Inner function to attempt PUT with automatic retry on SHA conflict
  const attemptPut = async (targetSha, attempt = 1) => {
    const bodyPayload = {
      message: commitMessage || defaultMsg,
      content: contentBase64,
      branch: GITHUB_CONFIG.BRANCH,
    };
    if (targetSha) {
      bodyPayload.sha = targetSha;
    }

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      const errMsg = errJson.message || putRes.statusText || 'Unknown error';

      // AUTO-RECOVERY for 409 Conflict: GitHub says "does not match <sha>"
      if ((putRes.status === 409 || errMsg.includes('does not match')) && attempt <= 2) {
        // 1. Exact SHA regex extraction from GitHub's error message
        const match = errMsg.match(/does not match\s+([a-f0-9]{40})/i);
        if (match && match[1]) {
          console.warn(`[GitHubSync] SHA conflict detected. Auto-recovering with exact SHA ${match[1]}`);
          return attemptPut(match[1], attempt + 1);
        }

        // 2. Query fresh tree SHA and retry
        const fresh = await getLatestFileSha(cleanToken);
        if (fresh.sha && fresh.sha !== targetSha) {
          console.warn(`[GitHubSync] SHA conflict detected. Auto-recovering with fresh tree SHA ${fresh.sha}`);
          return attemptPut(fresh.sha, attempt + 1);
        }
      }

      return {
        success: false,
        error: errMsg || `Failed to push commit: ${putRes.statusText}`,
      };
    }

    const result = await putRes.json();
    return {
      success: true,
      commitSha: result.commit?.sha?.slice(0, 7) || 'latest',
      commitUrl: result.commit?.html_url || `https://github.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/commits/${GITHUB_CONFIG.BRANCH}`,
      deployedAt: new Date().toISOString(),
    };
  };

  try {
    // 1. Fetch initial fresh SHA
    const initialInfo = await getLatestFileSha(cleanToken);
    return await attemptPut(initialInfo.sha, 1);
  } catch (err) {
    return { success: false, error: err.message || 'Failed connecting to GitHub API.' };
  }
};
