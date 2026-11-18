const funnel = ['quiz_completed','result_viewed','report_requested'];
export function validEvent(input) {
  if (!input || typeof input!=='object' || Array.isArray(input)) return false;
  const keys=Object.keys(input).sort().join(',');
  if(input.event==='quiz_start') return keys==='event,source' && ['homepage','other'].includes(input.source);
  if(funnel.includes(input.event)) return keys==='event';
  if(input.event==='quiz_step_completed') return keys==='event,step' && Number.isInteger(input.step) && input.step>=1 && input.step<=15;
  if(input.event==='booking_clicked') return keys==='event,source' && ['homepage','results'].includes(input.source);
  // Anonymous homepage views provide the denominator for homepage-to-start.
  return input.event==='homepage_viewed' && keys==='event';
}
