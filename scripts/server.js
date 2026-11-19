/**
 * Local development server for the portfolio API.
 *
 * The project index is rebuilt before the server starts, keeping the served
 * index synchronized with the Markdown sources for each preview session.
 *
 * @module
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './build.js';

const PORT = 4173;
const HOST = '127.0.0.1';
const LOCAL_API_URL = `http://${HOST}:${PORT}`;
const PUBLISHED_API_URL = 'https://miguelbogota.github.io/miguelbogotadev-api';
const repositoryDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

/** Content types returned by the local static server. */
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.glb', 'model/gltf-binary'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.json', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.webp', 'image/webp'],
]);

/** Paths intentionally exposed by the local API server. */
const publicPathPrefixes = ['/assets/', '/projects/'];

/**
 * Sends a plain-text response with the shared development headers.
 *
 * @param {import('node:http').ServerResponse} response - Outgoing HTTP response.
 * @param {number} statusCode - HTTP status code to return.
 * @param {string} message - Plain-text response body.
 * @returns {void}
 */
function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(message);
}

/**
 * Resolves a public request without allowing traversal outside the repository.
 *
 * @param {string} pathname - Decoded URL pathname.
 * @returns {string | null} A safe local path, or null when the path is private.
 */
function resolvePublicFile(pathname) {
  if (pathname === '/index.json') {
    return path.join(repositoryDirectory, 'index.json');
  }

  const publicPrefix = publicPathPrefixes.find((prefix) => pathname.startsWith(prefix));

  if (!publicPrefix) {
    return null;
  }

  const filePath = path.resolve(repositoryDirectory, `.${pathname}`);
  const publicDirectory = path.resolve(repositoryDirectory, `.${publicPrefix}`);
  const isInsidePublicDirectory = filePath.startsWith(`${publicDirectory}${path.sep}`);

  return isInsidePublicDirectory ? filePath : null;
}

/**
 * Serves a portfolio API file during local development.
 *
 * @param {import('node:http').IncomingMessage} request - Incoming HTTP request.
 * @param {import('node:http').ServerResponse} response - Outgoing HTTP response.
 * @returns {void}
 */
function handleRequest(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendText(response, 405, 'Method not allowed.');
    return;
  }

  const requestUrl = new URL(request.url ?? '/', `http://${HOST}:${PORT}`);

  if (requestUrl.pathname === '/') {
    sendText(response, 200, 'Portfolio API development server is running.');
    return;
  }

  let pathname;

  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    sendText(response, 400, 'Invalid request path.');
    return;
  }

  const filePath = resolvePublicFile(pathname);

  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendText(response, 404, 'Not found.');
    return;
  }

  if (pathname === '/index.json') {
    const index = fs.readFileSync(filePath, 'utf8').replaceAll(PUBLISHED_API_URL, LOCAL_API_URL);

    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(request.method === 'HEAD' ? undefined : index);
    return;
  }

  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Type':
      contentTypes.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
}

/** Local API HTTP server. */
const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
  console.log(`\n✓ Portfolio API available at ${LOCAL_API_URL}`);
  console.log(`✓ Project index: ${LOCAL_API_URL}/index.json`);
});
