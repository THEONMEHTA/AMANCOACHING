import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const raw = execFileSync('git', ['log', '--reverse', '--format=%H%x09%aI%x09%cI%x09%s'], { encoding: 'utf8' }).trim();
const records = raw.split('\n').filter(Boolean).map(line => {
 const [sha, authoredAt, committedAt, subject] = line.split('\t'); return { sha, authoredAt, committedAt, subject };
});
await mkdir('evidence', { recursive: true });
await writeFile('evidence/commit-history.json', JSON.stringify({ exportedAt: new Date().toISOString(), head: records.at(-1)?.sha, commits: records }, null, 2) + '\n');
await writeFile('evidence/commit-history.md', `# Commit history\n\nGenerated ${new Date().toISOString()}. Git records author and commit timestamps with timezone offsets. These timestamps are repository evidence, not payment or delivery receipts. Regenerate after every subsequent commit.\n\n| Commit | Authored | Committed | Milestone |\n| --- | --- | --- | --- |\n${records.map(r => `| ${r.sha} | ${r.authoredAt} | ${r.committedAt} | ${r.subject.replaceAll('|','/')} |`).join('\n')}\n`);
console.log(`Exported ${records.length} commits through ${records.at(-1)?.sha} to evidence/commit-history.{json,md}`);
