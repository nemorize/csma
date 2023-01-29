/**
 * To get an SSH server information.
 */
import { getReadyToConnectSSHServer, stopReadyToConnectSSHServer } from '../libs/server.js';

/**
 * To print the console output.
 */
import chalk from 'chalk';
import { error, info, success, log } from '../libs/console.js';

/**
 * To receive enter from the console.
 */
import { createInterface } from 'readline';

// noinspection JSUnusedGlobalSymbols
/**
 * Execute command.
 *
 * @param {{alias: string}} params
 * @returns {Promise<void>}
 */
const execute = async (params) => {
    let username, host, port, expiresIn;
    try {
        ({ username, host, port, expiresIn } = await getReadyToConnectSSHServer(params.alias));
    }
    catch (e) {
        error('Failed to retrieve SSH server information.');
        return log(e);
    }

    info(`Connection ready. Use "${username}@${host}:${port}" to connect before the session expires(${expiresIn}s).\nIf you make a connection before expires, please press enter to expire session manually.`);
    setTimeout(() => {
        info(`Session expired.\n`);
        process.exit();
    }, expiresIn * 1000);

    process.stdout.write(chalk.white('\nPress enter to expire session manually.'));
    createInterface({ input: process.stdin, output: process.stdout }).on('line', async () => {
        await stopReadyToConnectSSHServer(params.alias);
        success(`Session has been successfully expired.\n`);
        process.exit();
    });
};

export { execute };