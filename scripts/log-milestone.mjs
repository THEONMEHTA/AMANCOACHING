import { appendFile } from 'node:fs/promises';
const [title, requested, files, verification, pending = 'None for this milestone.'] = process.argv.slice(2);
if (!title || !requested || !files || !verification) throw new Error('Usage: node scripts/log-milestone.mjs title requested files verification [pending]');
await appendFile('AUDIT_LOG.md', `\n## ${new Date().toISOString()} — ${title}\n\n- **Requested:** ${requested}\n- **Files created/modified:** ${files}\n- **Verification:** ${verification}\n- **Pending / limitations:** ${pending}\n`);
