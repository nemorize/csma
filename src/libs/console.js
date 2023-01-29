/**
 * To colorize the console.
 */
import chalk from 'chalk';

/**
 * Print out the basic message.
 *
 * @param {string} message
 */
const log = (message) => {
    console.log(`${message}`);
};

/**
 * Print out the success message.
 *
 * @param {string} message
 */
const success = (message) => {
    const text = `\n${chalk.black.bgGreen(' SUCCESS ')}\n${chalk.green(message)}`;
    log(text);
};

/**
 * Print out the info message.
 *
 * @param {string} message
 */
const info = (message) => {
    const text = `\n${chalk.black.bgBlue(' INFO ')}\n${chalk.blue(message)}`;
    log(text);
};

/**
 * Print out the error message.
 *
 * @param {string} message
 */
const error = (message) => {
    const text = `\n${chalk.black.bgRed(' ERROR ')}\n${chalk.red(message)}`;
    log(text);
};

/**
 * Print out new lines.
 *
 * @param {int} count
 */
const nl = (count) => {
    if (count <= 0) {
        count = 1;
    }

    log('\n'.repeat(count - 1));
}

/**
 * Print out a badge.
 *
 * @param {string} title
 * @param {'green'|'blue'|'red'|'yellow'|'magenta'} color
 */
const badge = (title, color) => {
    color = color.substring(0, 1).toUpperCase() + color.substring(1);
    const text = chalk[`bg${color}`].black(` ${title} `);
    log(`${text}`);
};

export { log, success, info, error, nl, badge };