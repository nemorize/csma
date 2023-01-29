/**
 * To get an SSH server information.
 */
import { getReadyToConnectSSHServer } from '../libs/server.js';

/**
 * To print the console output.
 */
import { error, info, log, nl } from '../libs/console.js';

/**
 * To open SSH client.
 */
import { execSync } from 'child_process';

// noinspection JSUnusedGlobalSymbols
/**
 * Execute command.
 *
 * @param {{alias: string}} params
 * @returns {Promise<void>}
 */
const execute = async (params) => {
    let username, host, port;
    try {
        ({ username, host, port } = await getReadyToConnectSSHServer(params.alias));
    }
    catch (e) {
        error('Failed to retrieve SSH server information.');
        return log(e);
    }

    execSync(`ssh -i ~/.csma/id_rsa ${username}@${host} -p ${port}`, { stdio: 'inherit' });

    nl(1);
    info(`Connection to "${username}@${host}:${port}" has been terminated.`);
};

export { execute };