/**
 * GitHub & Vercel Automated Deployment Service
 * Enables the Admin CMS to commit changes directly to MALLIK122/AMStudio on GitHub,
 * keeping both public/data/projects.json and src/data/initialData.js synced.
 * Any device visiting the website automatically loads the latest live projects.
 */

export const GITHUB_CONFIG = {
  OWNER: 'MALLIK122',
  REPO: 'AMStudio',
  BRANCH: 'main',
  DATA_PATH: 'src/data/initialData.js',
  JSON_DATA_PATH: 'public/data/projects.json',
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
 * Generate JSON string for public/data/projects.json
 */
export const generateProjectsJson = (projects, profile) => {
  const version = Date.now();
  return JSON.stringify({
    version,
    updatedAt: new Date().toISOString(),
    projects,
    profile,
  }, null, 2);
};

/**
 * Helper to fetch the latest blob SHA of a file directly from GitHub.
 * Uses cache busting and falls back to git tree endpoint.
 */
export const getLatestFileSha = async (token, filePath = GITHUB_CONFIG.DATA_PATH) => {
  const cleanToken = token.trim();
  const cacheBuster = Date.now();

  // 1. Try Contents API with cache-busting query param
  try {
    const contentsUrl = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${filePath}?ref=${GITHUB_CONFIG.BRANCH}&_cb=${cacheBuster}`;
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
    console.warn(`[GitHubSync] Contents API fetch failed for ${filePath}, trying Tree API fallback:`, err);
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
        const item = treeData.tree.find((t) => t.path === filePath);
        if (item && item.sha) {
          return { sha: item.sha, exists: true };
        }
      }
    }
  } catch (err) {
    console.warn(`[GitHubSync] Tree API fetch failed for ${filePath}:`, err);
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
 * Single file commit helper with auto-recovery for 409 conflict
 */
export const pushSingleFile = async ({ token, filePath, contentStr, commitMessage }) => {
  const cleanToken = token.trim();
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${filePath}`;
  const contentBase64 = utf8ToBase64(contentStr);

  const attemptPut = async (targetSha, attempt = 1) => {
    const bodyPayload = {
      message: commitMessage,
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

      if ((putRes.status === 409 || errMsg.includes('does not match')) && attempt <= 2) {
        const match = errMsg.match(/does not match\s+([a-f0-9]{40})/i);
        if (match && match[1]) {
          console.warn(`[GitHubSync] SHA conflict on ${filePath}. Retrying with exact SHA ${match[1]}`);
          return attemptPut(match[1], attempt + 1);
        }

        const fresh = await getLatestFileSha(cleanToken, filePath);
        if (fresh.sha && fresh.sha !== targetSha) {
          console.warn(`[GitHubSync] Retrying with fresh SHA ${fresh.sha} for ${filePath}`);
          return attemptPut(fresh.sha, attempt + 1);
        }
      }

      return {
        success: false,
        error: errMsg || `Failed to push ${filePath}: ${putRes.statusText}`,
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

  const initialInfo = await getLatestFileSha(cleanToken, filePath);
  return await attemptPut(initialInfo.sha, 1);
};

/**
 * Push updated project data directly to GitHub.
 * Syncs BOTH public/data/projects.json (for instant client fetches)
 * AND src/data/initialData.js (for Vite bundle builds).
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
  const defaultMsg = `chore(cms): update wedding invitation projects from admin dashboard [${new Date().toLocaleTimeString('en-US')}]`;
  const msg = commitMessage || defaultMsg;

  try {
    // 1. Commit public/data/projects.json (enables instant live multi-device fetch)
    const jsonStr = generateProjectsJson(projects, profile);
    const jsonRes = await pushSingleFile({
      token: cleanToken,
      filePath: GITHUB_CONFIG.JSON_DATA_PATH,
      contentStr: jsonStr,
      commitMessage: `data: update projects.json for live multi-device sync`,
    });

    // 2. Commit src/data/initialData.js (updates repo code for Vercel builds)
    const codeStr = generateInitialDataFile(projects, profile);
    const codeRes = await pushSingleFile({
      token: cleanToken,
      filePath: GITHUB_CONFIG.DATA_PATH,
      contentStr: codeStr,
      commitMessage: msg,
    });

    if (jsonRes.success || codeRes.success) {
      return {
        success: true,
        commitSha: codeRes.commitSha || jsonRes.commitSha || 'latest',
        commitUrl: codeRes.commitUrl || jsonRes.commitUrl,
        deployedAt: new Date().toISOString(),
      };
    }

    return {
      success: false,
      error: codeRes.error || jsonRes.error || 'Failed to push updates to GitHub.',
    };
  } catch (err) {
    return { success: false, error: err.message || 'Failed connecting to GitHub API.' };
  }
};
