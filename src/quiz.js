export const disclaimer = 'This is a coaching self-reflection tool, not a validated assessment or a diagnosis of burnout.';

export function questionsFor(content) {
  return [0, 1, 2].flatMap(round => content.dimensions.map(d => ({ dimension: d.id, statement: d.statements[round] })));
}

export function band(mean) {
  if (mean < 2.5) return 'Less consistent';
  if (mean < 3.8) return 'Developing consistency';
  return 'More consistent';
}

export function calculate(content, answers) {
  const questions = questionsFor(content);
  if (answers.length !== 15 || !questions.every((_, i) => Number.isInteger(answers[i]) && answers[i] >= 1 && answers[i] <= 5)) {
    throw new Error('Please answer all fifteen questions.');
  }
  const totals = content.dimensions.map((_, i) => answers[i] + answers[i + 5] + answers[i + 10]);
  return interpret(content, totals);
}

export function interpret(content, totals) {
  if (!Array.isArray(totals) || totals.length !== 5 || !content.dimensions.every((_, i) => Number.isInteger(totals[i]) && totals[i] >= 3 && totals[i] <= 15)) throw new Error('Invalid snapshot totals.');
  const rows = content.dimensions.map((d, i) => ({ ...d, total: totals[i], score: (totals[i] / 3).toFixed(1), band: band(totals[i] / 3) }));
  const low = rows.filter(d => d.total === Math.min(...totals));
  const high = rows.filter(d => d.total === Math.max(...totals));
  return { rows, low, high, balanced: low.length === 5, allHigh: low[0].total / 3 >= 3.8 };
}

export function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email.trim());
}
