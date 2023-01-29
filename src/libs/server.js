/**
 * To retrieve user home directory.
 */
import { homedir } from 'os';

/**
 * To use the file system.
 */
import { stat, mkdir, readFile, writeFile } from 'fs/promises';

/**
 * To print out the console output.
 */
import { info, error, log } from './console.js';

/**
 * To send HTTP request.
 */
import got from 'got';

/**
 * CSMA user directory.
 *
 * @type {string}
 */
const userDir = `${homedir()}/.csma`;

/**
 * Create a new CSMA user directory.
 *
 * @returns {Promise<void>}
 */
const createUserDir = async () => {
    try {
        await stat(userDir);
    }
    catch {
        await mkdir(userDir);
        info(`Configuration directory "${userDir}" created.`);
    }
};

/**
 * CSMA token object.
 *
 * @type {Object|null}
 */
let token = null;

/**
 * Get a CSMA token object.
 *
 * @returns {Object}
 */
const getTokenData = async () => {
    if (token !== null) {
        return token;
    }

    const tokenDir = `${userDir}/token.json`;
    try {
        token = JSON.parse((await readFile(tokenDir)).toString());
        return token;
    }
    catch {
        error('Not authenticated. You should run "csma auth [server]" command to authenticate your identity.\n');
        process.exit();
    }
};


/**
 * Write token information to the storage.
 *
 * @param {string} server
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {int} expiresAt
 * @returns {Promise<void>}
 */
const writeToken = async (server, accessToken, refreshToken, expiresAt) => {
    if (!server || !accessToken || !refreshToken || !expiresAt) {
        error('Failed to save token information. Something went wrong.');
        return;
    }

    const tokenDir = `${userDir}/token.json`;
    const raw = JSON.stringify({ server, accessToken, refreshToken, expiresAt }, null, 2);
    await writeFile(tokenDir, raw);
    token = null;
};

/**
 * Retrieve token information from the server by using authorization code.
 *
 * @param {string} server
 * @param {string} code
 * @returns {Promise<void>}
 */
const retrieveTokenByAuthorizeCode = async (server, code) => {
    const endpoint = `${server}/auth/token?code=${code}`;
    const json = await got.get(endpoint).json();
    await writeToken(server, json.accessToken, json.refreshToken, json.expiresAt);

    info(`Access token saved at "${userDir}/token.json".`);
};

/**
 * Get a server url.
 *
 * @returns {Promise<string>}
 */
const getServerUrl = async () => {
    const token = await getTokenData();
    return token.server;
}

/**
 * Get an access token.
 *
 * @param {boolean} refresh
 * @returns {Promise<void>}
 */
const getAccessToken = async (refresh) => {
    const token = await getTokenData();

    if (refresh === false) {
        return token.accessToken;
    }

    const timestamp = Math.floor(new Date().getTime() / 1000);
    if (token.expiresAt > timestamp) {
        return token.accessToken;
    }

    const endpoint = `${token.server}/auth/token?refresh_token=${token.refreshToken}`;
    try {
        const json = await got.get(endpoint).json();
        await writeToken(token.server, json.accessToken, json.refreshToken, json.expiresAt);
        info(`Previous access token expired at ${token.expiresAt}, and the new one will expires at ${json.expiresAt}.`);
    }
    catch (e) {
        error(`Failed to refresh access token. Previous one has been expired at ${token.expiresAt}.`);
        log(e.toString() + '\n');
        process.exit();
    }
};

/**
 * Update an SSH public key.
 *
 * @param {string} pub
 * @returns {Promise<void>}
 */
const updatePublicKey = async (pub) => {
    const serverUrl = await getServerUrl();
    const accessToken = await getAccessToken(true);

    const endpoint = `${serverUrl}/key`;
    return got.patch(endpoint, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        json: { publicKey: pub }
    });
};

/**
 * Get ready to connect an SSH server.
 *
 * @param {string} alias
 * @returns {Promise<Object>}
 */
const getReadyToConnectSSHServer = async (alias) => {
    const serverUrl = await getServerUrl();
    const accessToken = await getAccessToken(true);

    const endpoint = `${serverUrl}/server/${btoa(alias)}/ready`;
    return got.post(endpoint, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    }).json();
};

/**
 * Stop ready to connect.
 *
 * @param {string} alias
 * @returns {Promise<Object>}
 */
const stopReadyToConnectSSHServer = async (alias) => {
    const serverUrl = await getServerUrl();
    const accessToken = await getAccessToken(true);

    const endpoint = `${serverUrl}/server/${btoa(alias)}/ready`;
    return got.delete(endpoint, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    }).json();
};

/**
 * Get all available SSH servers.
 *
 * @returns {Promise<Array>}
 */
const getSSHServerList = async () => {
    const serverUrl = await getServerUrl();
    const accessToken = await getAccessToken(true);

    const endpoint = `${serverUrl}/server`;
    return got.get(endpoint, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    }).json();
};

export { createUserDir, retrieveTokenByAuthorizeCode, getServerUrl, getAccessToken, updatePublicKey, getReadyToConnectSSHServer, stopReadyToConnectSSHServer, getSSHServerList };