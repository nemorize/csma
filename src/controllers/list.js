/**
 * To get an SSH server information.
 */
import { getSSHServerList } from '../libs/server.js';

/**
 * To print the console output.
 */
import chalk from 'chalk';
import { error, log, badge } from '../libs/console.js';

// noinspection JSUnusedGlobalSymbols, JSUnusedLocalSymbols
/**
 * Execute command.
 *
 * @param {Object} params
 * @returns {Promise<void>}
 */
const execute = async (params) => {
    let list;
    try {
        list = await getSSHServerList();
    }
    catch (e) {
        error('Failed to retrieve SSH server list.');
        return log(e);
    }

    badge('LIST', 'green');
    for (let item of list) {
        log(
            '\n  '
            + chalk.green(item.alias.padEnd(30))
            + chalk.yellow(item.username)
            + chalk.white('@') + item.host
            + chalk.white(':') + chalk.blue(item.port)
        );
    }
};

export { execute };