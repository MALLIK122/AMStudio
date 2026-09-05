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
  return window.btoa(unescape(encodeURIComponent(str)));
};

/**
 * Safely decode Base64 string to UTF-8
 */
export const base64ToUtf8 = (base64) => {
  return decodeURIComponent(escape(window.atob(base64.replace(/\s/g, ''))));
};

/**
 * Generate source code string for src/data/initialData.js
 */
export const generateInitialDataFile = (projects, profile) => {
  return `export const INITIAL_PROJECTS = ${JSON.stringify(projects, null, 2)};\n\nexport const INITIAL_STUDIO_PROFILE = ${JSON.stringify(profile, null, 2)};\n`;
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

  try {
    // 1. Get existing file SHA
    let existingSha = null;
    const getRes = await fetch(`${url}?ref=${GITHUB_CONFIG.BRANCH}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (getRes.ok) {
      const existingData = await getRes.json();
      existingSha = existingData.sha;
    } else if (getRes.status !== 404) {
      const errJson = await getRes.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.message || `Failed to read existing file: ${getRes.statusText}`,
      };
    }

    // 2. Generate updated file code
    const fileCode = generateInitialDataFile(projects, profile);
    const contentBase64 = utf8ToBase64(fileCode);

    // 3. Commit and push to main branch
    const defaultMsg = `chore(cms): update wedding invitation projects from admin dashboard [${new Date().toLocaleTimeString('en-US')}]`;
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage || defaultMsg,
        content: contentBase64,
        sha: existingSha || undefined,
        branch: GITHUB_CONFIG.BRANCH,
      }),
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.message || `Failed to push commit: ${putRes.statusText}`,
      };
    }

    const result = await putRes.json();
    return {
      success: true,
      commitSha: result.commit?.sha?.slice(0, 7) || 'latest',
      commitUrl: result.commit?.html_url || `https://github.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/commits/${GITHUB_CONFIG.BRANCH}`,
      deployedAt: new Date().toISOString(),
    };
  } catch (err) {
    return { success: false, error: err.message || 'Failed connecting to GitHub API.' };
  }
};
