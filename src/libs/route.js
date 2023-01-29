/**
 * To print out console output.
 */
import chalk from 'chalk';
import { log, error, nl, badge } from './console.js';

/**
 * Parse the arguments.
 *
 * @param {Object<string, Object>} commands
 */
const parse = async (commands) => {
    const argv = process.argv.slice(2);
    if (argv.length === 0 || argv[0] === 'help') {
        return help(commands);
    }

    const command = argv.shift();
    if (typeof commands[command] === 'undefined') {
        error(`Command "${command} does not exists.\n`);
        return help(commands);
    }

    const expected = commands[command].params;
    if (argv.length !== expected.length) {
        error(`Command "${command}" expects ${expected.length} parameter(s), ${argv.length} parameter(s) given.\n`);
        return help(commands);
    }

    const params = {};
    for (let i in expected) {
        params[expected[i].name] = argv[i];
    }

    return { command, params };
};

/**
 * Help command.
 *
 * @param {Object<string, Object>} commands
 * @returns {void}
 */
const help = async (commands) => {
    nl(1);

    badge('USAGE', 'green');
    nl(1);
    log(`  csma ${chalk.green('<command>')} ${chalk.yellow('[arguments]')}`);
    nl(2);

    badge('COMMANDS', 'green');
    nl(1);
    for (let command in commands) {
        printCommand(command, commands[command]);
    }

    printCommand('help', { description: 'Need some help?', params: [] });
    process.exit();
};

const printCommand = (title, info) => {
    const titleText = 'csma ' + chalk.green(title) + ' ' + info.params.map((param) => {
        return chalk.yellow(`[${param.name}]`)
    }).join(' ');
    const descriptionText = chalk.blue(`- ${info.description}`);
    log(`  ${titleText}\n  ${descriptionText}`);

    if (info.params.length !== 0) {
        const paramsText = info.params.map((param) => {
            return chalk.white('  >') + chalk.yellow(` [${param.name}]`.padEnd(20)) + chalk.white(param.description);
        }).join('\n');
        log(paramsText);
    }

    nl(1);
};

export { parse, help };