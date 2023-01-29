/**
 * To open browser.
 */
import { exec } from 'child_process';

/**
 * To print the console output.
 */
import chalk from 'chalk';
import { nl, badge, log } from '../libs/console.js';

// noinspection JSUnusedGlobalSymbols
/**
 * Execute command.
 *
 * @returns {Promise<void>}
 */
const execute = async () => {
    const url = 'https://github.com/nemorize/csma';
    if (process.platform === 'darwin') {
        exec(`open ${url}`);
    }
    else if (process.platform === 'win32') {
        exec(`start ${url}`);
    }
    else {
        exec(`xdg-open ${url}`);
    }

    nl(1);
    badge('GITHUB', 'magenta');
    log(chalk.magenta('Thanks for your attention. Feel free to contribute with issues and PR\'s.'));
    log(url);
};

export { execute };