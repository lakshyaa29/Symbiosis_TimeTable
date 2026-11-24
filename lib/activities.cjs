const fs = require('node:fs/promises');
const path = require('node:path');
const { randomBytes, randomUUID, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const derive = promisify(scrypt);

const ACTIVITY_TYPES = Object.freeze({ fun: 'Fun & games', cultural: 'Cultural', sports: 'Sports & fitness', workshop: 'Workshop', club: 'Club meetup', seminar: 'Talk / seminar', competition: 'Competition', other: 'Other activity' });
class ActivityError extends Error { constructor(message, status = 400) { super(message); this.status = status; } }
function validateActivity(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ActivityError('Enter the activity details.');
  const text = (key, label, max, optional = false) => {
    if (typeof input[key] !== 'string') { if (optional && input[key] == null) return ''; throw new ActivityError(`Enter ${label}.`); }
    const value = input[key].trim();
    if ((!optional && !value) || value.length > max) throw new ActivityError(`${label} must contain ${optional ? 'up to' : '1–'}${max} characters.`);
    return value;
  };
  const type = text('type', 'an activity type', 30);
  if (!Object.hasOwn(ACTIVITY_TYPES, type)) throw new ActivityError('Choose a listed activity type.');
  const title = text('title', 'an activity title', 100);
  const organizer = text('organizer', 'an organizer or club name', 100);
  const venue = text('venue', 'a venue', 160);
  const description = text('description', 'a description', 2000);
  const audience = text('audience', 'an audience', 120, true) || 'All students';
  const customType = type === 'other' ? text('customType', 'the activity type', 60) : '';
  const date = text('date', 'a date', 10);
  const parsed = new Date(date + 'T12:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new ActivityError('Choose a valid activity date.');
  const start = text('start', 'a start time', 5);
  const end = text('end', 'an end time', 5, true);
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!time.test(start) || (end && (!time.test(end) || end <= start))) throw new ActivityError('End time must be after the start time on the same day.');
  return { type, customType, title, organizer, venue, description, audience, date, start, end };
}
async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 4 || password.length > 128) throw new ActivityError('Use an organizer password between 4 and 128 characters.');
  const salt = randomBytes(24).toString('hex');
  const hash = (await derive(password, salt, 64)).toString('hex');
  return { salt, hash };
}
async function checkPassword(password, config) {
  if (typeof password !== 'string' || password.length > 128 || !config || !/^[a-f0-9]{128}$/.test(config.hash || '') || !/^[a-f0-9]{48}$/.test(config.salt || '')) return false;
  const candidate = await derive(password, config.salt, 64);
  return timingSafeEqual(candidate, Buffer.from(config.hash, 'hex'));
}
async function writeJSON(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = file + '.' + randomUUID() + '.tmp';
  try { await fs.writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 }); await fs.rename(temporary, file); }
  catch (error) { await fs.rm(temporary, { force: true }).catch(() => {}); throw error; }
}
function createActivityStore(dataDir, configFile, environmentPassword) {
  const eventsFile = path.join(dataDir, 'activities.json');
  let queue = Promise.resolve();
  const environmentConfig = environmentPassword ? hashPassword(environmentPassword) : null;
  async function readEvents() {
    try { const events = JSON.parse(await fs.readFile(eventsFile, 'utf8')); if (!Array.isArray(events)) throw new Error('Invalid activity store'); return events; }
    catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  }
  async function configuration() {
    if (environmentConfig) return environmentConfig;
    try { return JSON.parse(await fs.readFile(configFile, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') throw new ActivityError('Organizer publishing is not configured yet. Set the password on the local server.', 503); throw error; }
  }
  return {
    list: readEvents,
    async verifyAdministrator(password) {
      if (!(await checkPassword(password, await configuration()))) throw new ActivityError('Incorrect administrator password.', 401);
      return true;
    },
    async publish(input, password) {
      if (!(await checkPassword(password, await configuration()))) throw new ActivityError('Incorrect organizer password. Your activity has not been published.', 401);
      const details = validateActivity(input);
      const activity = { id: randomUUID(), ...details, createdAt: new Date().toISOString() };
      const task = queue.then(async () => {
        const events = await readEvents();
        if (events.length >= 5000) throw new ActivityError('The activity board is full. Ask the organizer to archive older records.', 409);
        await writeJSON(eventsFile, [activity, ...events]);
        return activity;
      });
      queue = task.catch(() => {});
      return task;
    }
  };
}
function createActivitiesHandler(store, port) {
  const attempts = new Map();
  const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(body)); };
  return async function handle(request, response) {
    const url = new URL(request.url, 'http://localhost');
    const administrator = url.pathname === '/api/admin/unlock';
    if (url.pathname !== '/api/activities' && !administrator) return false;
    if (request.method === 'GET' && !administrator) {
      try { send(response, 200, { activities: await store.list() }); }
      catch { send(response, 500, { error: 'Activities could not be loaded. Existing records have been kept.' }); }
      return true;
    }
    if (request.method !== 'POST') { send(response, 405, { error: 'Method not allowed.' }); return true; }
    const origin = request.headers.origin;
    const ownHost = request.headers.host;
    if (origin && origin !== `http://${ownHost}` && origin !== `https://${ownHost}`) { send(response, 403, { error: 'Publish activities from this portal.' }); return true; }
    if (!String(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) { send(response, 415, { error: 'Submit the activity as JSON.' }); return true; }
    const address = request.socket.remoteAddress || 'local';
    const now = Date.now();
    if (attempts.size > 1000) for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    const attempt = attempts.get(address);
    if (attempt?.until > now && attempt.count >= 8) { send(response, 429, { error: 'Too many incorrect passwords. Try again in five minutes.' }); return true; }
    try {
      let size = 0; const chunks = [];
      for await (const chunk of request) { size += chunk.length; if (size > 16000) throw new ActivityError('Activity details are too large.', 413); chunks.push(chunk); }
      const body = Buffer.concat(chunks).toString('utf8');
      let input;
      try { input = JSON.parse(body); } catch { throw new ActivityError('Activity details could not be read.'); }
      if (administrator) {
        await store.verifyAdministrator(input?.password);
        attempts.delete(address);
        send(response, 200, { authorized: true });
        return true;
      }
      const activity = await store.publish(input?.activity, input?.password);
      attempts.delete(address);
      send(response, 201, { activity });
    } catch (error) {
      if (error.status === 401) { const old = attempts.get(address); attempts.set(address, { count: old?.until > now ? old.count + 1 : 1, until: old?.until > now ? old.until : now + 300000 }); }
      send(response, error.status || 500, { error: error.status ? error.message : 'Publishing failed. Your activity has not been published. Try again.' });
    }
    return true;
  };
}
module.exports = { ACTIVITY_TYPES, ActivityError, validateActivity, hashPassword, checkPassword, writeJSON, createActivityStore, createActivitiesHandler };
