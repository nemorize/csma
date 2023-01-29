/**
 * To generate an SSH key pair.
 */
import { generateKeyPair } from 'crypto';

/**
 * To convert pem to openssh format.
 */
import Module from 'node:module';
const require = Module.createRequire(import.meta.url);
const sshpk = require('sshpk');

/**
 * To print the console output.
 */
import { error, info, log } from '../libs/console.js';

/**
 * To update a public key.
 */
import { updatePublicKey } from '../libs/server.js';

/**
 * To update a private key.
 */
import { homedir } from 'os';
import { writeFile } from 'fs/promises';

// noinspection JSUnusedGlobalSymbols
/**
 * Execute command.
 *
 * @param {{password: string}} params
 * @returns {Promise<void>}
 */
const execute = async (params) => {
    let publicKey, privateKey;
    try {
        const passphrase = params.password !== '--preserve-empty' ? params.password : null;
        ({ publicKey, privateKey } = await generateSSHKeyPair(passphrase));
    }
    catch (e) {
        error('Failed to generate an SSH key pair.');
        return log(e);
    }

    try {
        await updatePublicKey(publicKey);
        await writeFile(`${homedir()}/.csma/id_rsa`, privateKey);
        info(`SSH public key updated. Now you can use your new SSH key.`);
    }
    catch (e) {
        error('Failed to update SSH public key.');
        return log(e);
    }
};

/**
 * Generate an SSH key pair.
 *
 * @param {string|null} passphrase
 * @returns {Promise<Object>}
 */
const generateSSHKeyPair = (passphrase) => {
    const privateKeyEncoding = {
        type: 'pkcs8',
        format: 'pem'
    };
    if (passphrase !== null) {
        privateKeyEncoding.cipher = 'aes-256-cbc';
        privateKeyEncoding.passphrase = passphrase;
    }

    return new Promise((resolve, reject) => {
        generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding
        }, (err, publicKey, privateKey) => {
            if (err !== null) {
                return reject(err);
            }

            const parsed = sshpk.parseKey(publicKey, 'pem');
            resolve({ publicKey: parsed.toBuffer('ssh').toString().replace('(unnamed)', '').trim(), privateKey });
        });
    });
};

export { execute };