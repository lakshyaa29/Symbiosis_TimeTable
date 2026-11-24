const path = require('node:path');
const { hashPassword, writeJSON } = require('../lib/activities.cjs');
async function readPassword() {
  process.stdout.write('Enter the organizer password (input is hidden): ');
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise(resolve => {
    let value = '';
    const read = chunk => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') process.exit(130);
        if (character === '\r' || character === '\n') {
          process.stdin.off('data', read);
          if (process.stdin.isTTY) process.stdin.setRawMode(false);
          process.stdin.pause();
          if (typeof process.stdin.unref === 'function') process.stdin.unref();
          process.stdout.write('\n'); resolve(value); return;
        }
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (character >= ' ') value += character;
      }
    };
    process.stdin.on('data', read);
  });
}
(async () => {
  const config = await hashPassword(await readPassword());
  await writeJSON(path.join(__dirname, '..', '.local', 'organizer.json'), config);
  console.log('Organizer password saved. It is not included in the public website files.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
