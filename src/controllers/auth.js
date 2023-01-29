/**
 * To receive an auth token from the server.
 */
import Koa from 'koa';

/**
 * To print the console output.
 */
import { log, success, error } from '../libs/console.js';

/**
 * To find out an available port.
 */
import { getPortPromise } from 'portfinder'

/**
 * To response HTML output.
 */
import { dirname, normalize } from 'path';
import { readFile } from 'fs/promises';

/**
 * To retrieve and save access token.
 */
import { retrieveTokenByAuthorizeCode } from '../libs/server.js';

/**
 * Server URL
 *
 * @type {string}
 */
let server;

// noinspection JSUnusedGlobalSymbols
/**
 * Execute command.
 *
 * @param {{server: string}} params
 * @returns {Promise<void>}
 */
const execute = async (params) => {
    server = params.server.replace(/\/+$/, '');
    // noinspection HttpUrlsUsage
    if (!server.startsWith('http://') && !server.startsWith('https://')) {
        // noinspection HttpUrlsUsage
        return error('Server URL must starts with \'http://\' or \'https://\'.');
    }

    let port;
    try {
        port = await getPortPromise({ port: 3000, stopPort: 65535 });
    }
    catch {
        return error('There\'s no available ports between 3000 and 65535.');
    }

    const app = new Koa();
    app.use(controller).listen(port);

    success(`Authentication server has been opened to ::${port}.\nPlease open the link below, and finish the authenticate flow from the server.`);
    process.stdout.write(`${server}/auth/authorize?port=${port}`);
};

/**
 * Koa controller.
 * Receive an auth token and save the token into storage.
 *
 * @param {Object} ctx
 * @returns {Promise<void>}
 */
const controller = async (ctx) => {
    if (ctx.request.method !== 'GET') {
        return ctx.throw(404);
    }

    const code = ctx.request.query.code;
    if (typeof code === 'undefined' || code === '') {
        return ctx.throw(404);
    }

    ctx.res.statusCode = 200;
    ctx.res.write(await getHtmlString());
    ctx.res.end();

    try {
        await retrieveTokenByAuthorizeCode(server, code);
    }
    catch (e) {
        error('Cannot retrieve access token from the server.');
        log(e.toString() + '\n');
        process.exit();
    }

    success('Authenticate successfully finished.\nNow you can generate an SSH key pair with "csma key [password]" command.\n');
    process.exit();
};

/**
 * Get HTML raw string from the file.
 *
 * @returns {Promise<string>}
 */
const getHtmlString = async () => {
    const dirPath = dirname(import.meta.url.substring(7));
    const htmlPath = normalize(`${dirPath}/../static/auth_complete.html`);

    return (await readFile(htmlPath)).toString();
};

export { execute };