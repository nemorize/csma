/**
 * To remove a directory.
 */
import { homedir } from 'os';
import { rm, mkdir } from 'fs/promises';

/**
 * To print the console output.
 */
import { success } from '../libs/console.js';

// noinspection JSUnusedGlobalSymbols
/**
 * Execute command.
 *
 * @returns {Promise<void>}
 */
const execute = async () => {
    const userDir = `${homedir()}/.csma`;
    await rm(userDir, { recursive: true, force: true });
    await mkdir(userDir);

    success('All authentication data and generated SSH key has been removed.');
};

export { execute };