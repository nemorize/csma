/**
 * To create a CSMA user directory.
 */
import { createUserDir } from './libs/server.js';

/**
 * To parse a command line arguments.
 */
import { parse } from './libs/route.js';

/**
 * Main.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
    const parsed = await parse({
        connect: {
            description: 'Connect to an SSH server immediately.',
            params: [
                { name: 'alias', description: 'SSH server alias that has been registered at the server.' }
            ]
        },
        ready: {
            description: 'Ready to connect an SSH server, to use the SSH key from an external client.',
            params: [
                { name: 'alias', description: 'SSH server alias.' }
            ]
        },
        auth: {
            description: 'Authenticate with the CSMA server.',
            params: [
                { name: 'server', description: 'Server URL to connect with.' }
            ]
        },
        key: {
            description: 'Generate and upload a new SSH key.',
            params: [
                { name: 'password', description: 'Passphrase to encrypt the key. Use "--preserve-empty" for no passphrase.' }
            ]
        },
        list: {
            description: 'List all available SSH servers.',
            params: []
        },
        reset: {
            description: 'Remove all authentication data and generated SSH key.',
            params: []
        },
        github: {
            description: 'Open CSMA github repository.',
            params: []
        },
    });

    const { execute } = await import(`./controllers/${parsed.command}.js`);
    await execute(parsed.params);
    console.log('');
};

createUserDir().then(main);