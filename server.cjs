try{process.loadEnvFile?.();}catch(error){if(error.code!=='ENOENT')throw error;}
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createActivityStore, createActivitiesHandler } = require('./lib/activities.cjs');

const {makeCloud}=require('./lib/cloud.cjs');
const cloud=makeCloud();
const root = path.resolve(__dirname, 'dist');
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be a number between 1 and 65535.');
  process.exit(1);
}
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.pdf': 'application/pdf' };
const activityStore = createActivityStore(path.join(__dirname, 'data'), path.join(__dirname, '.local', 'organizer.json'), process.env.ACTIVITY_PASSWORD);
const activitiesHandler = createActivitiesHandler(activityStore, port);
const server = http.createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  try { if (await cloud.handle(request,response)) return; if (await activitiesHandler(request, response)) return; }
  catch { response.writeHead(400); return response.end('Invalid request'); }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end('Method not allowed');
  }
  let name;
  try { name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); return response.end('Invalid URL'); }
  if (name === '/') name = '/index.html';
  const file = path.resolve(root, '.' + name);
  if (!file.startsWith(root + path.sep) || name.includes('\0')) {
    response.writeHead(403); return response.end('Forbidden');
  }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404); return response.end('File not found'); }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': stat.size });
    if (request.method === 'HEAD') return response.end();
    const stream = fs.createReadStream(file);
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  });
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Open http://localhost:${port} or choose another PORT.` : error.message);
  process.exit(1);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`\nSSPU timetable portal is running locally.\n\n  http://localhost:${port}\n\nKeep this terminal open. Press Ctrl+C to stop.\n`);
});
