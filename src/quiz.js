export const DIMENSIONS = ['clarity', 'influence', 'delegation', 'sustainability'];
export const LABELS = {
  clarity: 'Strategic clarity',
  influence: 'Confidence & influence',
  delegation: 'Delegation & ownership',
  sustainability: 'Sustainable leadership',
};
export const QUESTIONS = [
  { id: 'role', title: 'Where are you in your leadership journey?', help: 'Choose the description closest to your current role.', options: [
    ['new', 'Stepping into leadership', 'Building confidence in a new role'],
    ['manager', 'Leading a team', 'Supporting people and delivering together'],
    ['senior', 'Leading leaders', 'Balancing strategy, people and complexity'],
    ['founder', 'Running an organisation', 'Setting direction and carrying responsibility'],
  ] },
  { id: 'focus', title: 'What would you most like to change?', help: 'Your choice helps prioritise your action plan when responses are balanced.', options: [
    ['clarity', 'Create space for strategy', 'Spend less time reacting to the urgent'],
    ['influence', 'Speak with more confidence', 'Handle conversations and influence decisions'],
    ['delegation', 'Share the responsibility', 'Build ownership across your team'],
    ['sustainability', 'Make leadership sustainable', 'Protect energy and set workable boundaries'],
  ] },
  { id: 'clarity', title: 'How clear are your priorities?', help: 'Think about your working life over the past four weeks.', options: [
    [0, 'I can name my priorities and protect time for them', 'My attention usually matches what matters'],
    [1, 'I know my priorities, but urgent work often takes over', 'My direction is clear; my time is stretched'],
    [2, 'I switch between competing priorities most days', 'It is difficult to choose what comes first'],
    [3, 'I need space to work out what matters most', 'I am mostly responding to what arrives'],
  ] },
  { id: 'influence', title: 'How do you handle difficult conversations?', help: 'Choose what happens most often, rather than an ideal day.', options: [
    [0, 'I address them clearly and constructively', 'I can express my view and listen to others'],
    [1, 'I usually speak up, after some preparation', 'A little time helps me find the words'],
    [2, 'I often delay or soften what needs to be said', 'I worry about how the conversation will land'],
    [3, 'I tend to avoid them or leave my view unsaid', 'These conversations take a lot of my energy'],
  ] },
  { id: 'delegation', title: 'What happens when your team needs a decision?', help: 'If you do not lead a team yet, consider shared work with colleagues.', options: [
    [0, 'People decide within clear responsibilities', 'I support them without taking the work back'],
    [1, 'People own the work, with regular check-ins', 'Some decisions still come back to me'],
    [2, 'I am involved in most decisions', 'I find it difficult to step back'],
    [3, 'I often take work back or solve it myself', 'I have become the default decision-maker'],
  ] },
  { id: 'sustainability', title: 'How sustainable does your working week feel?', help: 'This is a reflection on work habits, not a health assessment.', options: [
    [0, 'I can maintain my boundaries and recover', 'There is space to think between demands'],
    [1, 'Busy periods stretch me, but I can reset', 'I usually notice when I need to adjust'],
    [2, 'Work regularly spills into time I meant to protect', 'My boundaries are difficult to maintain'],
    [3, 'My working pattern needs a meaningful change', 'I rarely make room to pause or reflect'],
  ] },
];
export const GUIDANCE = {
  clarity: {
    title: 'Make space for strategic clarity',
    intro: 'Your answers suggest that competing demands may be making it difficult to give your most important work consistent attention.',
    strength: 'You report a clear sense of priorities and some room to act on them. Use that direction to make choices explicit for the people around you.',
    actions: [
      ['This week', 'Choose one priority', 'Write down the one outcome that most needs your attention. Name one lower-priority request you can pause, renegotiate or delegate.'],
      ['Each week', 'Protect a thinking block', 'Reserve one realistic block for strategic work. Tell the people affected what this time is for and what can wait.'],
      ['After 30 days', 'Review your attention', 'Compare what you intended to prioritise with where your time went. Keep one change that helped and adjust one that did not.'],
    ],
    prompts: ['Which decisions could become easier if your priorities were explicit?', 'What are you agreeing to that no longer supports your main outcome?'],
  },
  influence: {
    title: 'Build confidence in the conversation',
    intro: 'Your answers suggest that speaking up or addressing difficult conversations could be a useful place to focus your leadership development.',
    strength: 'You report that you can express your perspective and engage with difficult conversations. Consider how that ability can help others contribute their own views.',
    actions: [
      ['This week', 'Prepare one conversation', 'Choose a conversation you have been delaying. Note the observable facts, your concern and the outcome you would like to discuss.'],
      ['Each week', 'Practise a clear request', 'Make one specific request and invite the other person’s perspective. Reflect on what you said clearly and what you left unsaid.'],
      ['After 30 days', 'Review your influence', 'Look back at the conversations you approached. Notice what helped you speak directly while remaining open to a different view.'],
    ],
    prompts: ['What do you need the other person to understand?', 'What would change if you asked for what you need more directly?'],
  },
  delegation: {
    title: 'Create more ownership in your team',
    intro: 'Your answers suggest that too many decisions or tasks may be coming back to you. Clearer ownership could create room for both you and your team.',
    strength: 'You report that others can take ownership within clear responsibilities. Keep supporting their judgement and make sure decision boundaries stay clear as work changes.',
    actions: [
      ['This week', 'Hand over one outcome', 'Choose one appropriate piece of work. Agree the outcome, decision boundaries and a check-in with the person taking it on.'],
      ['Each week', 'Coach before solving', 'When a decision comes back, ask what the person recommends and what support they need before offering your own answer.'],
      ['After 30 days', 'Review shared ownership', 'Discuss which decisions the team now owns, where responsibilities remain unclear and what you can hand over next.'],
    ],
    prompts: ['What makes it difficult to let another person approach the work differently?', 'Which decisions genuinely require your involvement?'],
  },
  sustainability: {
    title: 'Build a more sustainable working week',
    intro: 'Your answers suggest that your current working pattern may be leaving too little space for boundaries and reflection. Start with a change within your control.',
    strength: 'You report some ability to maintain boundaries and recover between demands. Notice which conditions support this and protect them during busier periods.',
    actions: [
      ['This week', 'Set one workable boundary', 'Identify a recurring availability pressure. Choose a realistic boundary and explain it to the people affected.'],
      ['Each week', 'Make room to reflect', 'Protect one short reflection block. Notice where your energy went and which commitments need a different agreement.'],
      ['After 30 days', 'Review what is sustainable', 'Look at which changes you could maintain. Keep one useful boundary and decide where you need a conversation about expectations.'],
    ],
    prompts: ['What expectation are you treating as fixed that could be discussed?', 'What would a sustainable week need to make room for?'],
  },
};
export function validateAnswers(answers) {
  return !!answers && QUESTIONS.every(q => q.options.some(o => o[0] === answers[q.id]));
}
export function getResult(answers) {
  if (!validateAnswers(answers)) throw new Error('Please answer all six questions.');
  const values = DIMENSIONS.map(id => answers[id]);
  const max = Math.max(...values), min = Math.min(...values);
  const focusAreas = DIMENSIONS.filter(id => answers[id] === max);
  const strengths = DIMENSIONS.filter(id => answers[id] === min);
  const balanced = max === min;
  const focus = focusAreas.includes(answers.focus) ? answers.focus : focusAreas[0];
  return {
    focus, focusAreas, strengths, balanced,
    // One question per area supports a reflection, not an overall score or psychometric ranking.
    allEstablished: max === 0,
    guidance: GUIDANCE[focus],
    role: QUESTIONS[0].options.find(o => o[0] === answers.role)[1],
    responses: DIMENSIONS.map(id => ({ id, label: LABELS[id], value: answers[id], answer: QUESTIONS.find(q => q.id === id).options[answers[id]][1] })),
  };
}
export function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email.trim());
}
