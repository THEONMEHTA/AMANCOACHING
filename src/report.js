import { jsPDF } from 'jspdf';
import { disclaimer } from './quiz.js';

export function createReport(result, focusId) {
  const pdf = new jsPDF({unit:'mm',format:'a4'});
  pdf.setProperties({title:'Your Leadership Snapshot',author:'Aman Coaching'});
  pdf.setFillColor(246,243,236);pdf.rect(0,0,210,297,'F');pdf.setTextColor(24,38,34);
  let y=22;
  function line(value,size=11,font='helvetica',style='normal',gap=4) {
    pdf.setFont(font,style);pdf.setFontSize(size);
    const lines=pdf.splitTextToSize(value.replace(/[’‘]/g,"'"),166);
    if(y+lines.length*size*.42>275){pdf.addPage();y=22;}
    pdf.text(lines,22,y);y+=lines.length*size*.42+gap;
  }
  line('Aman Coaching',17,'times','italic');
  line('Your Leadership Snapshot',30,'times');
  line('Your reflection on the last four weeks',11);
  const focus=result.low.find(row=>row.id===focusId);
  line('Where to focus next',15,'times');
  if(result.balanced)line('All five areas share the same score. You can choose which habit to practise.');
  else if(result.low.length>1)line('Joint lowest: '+result.low.map(row=>row.label).join(', ')+'.');
  if(result.allHigh)line('You report consistent habits across all five areas. Choose one to refine.');
  if(focus){line(focus.label+' ('+focus.score+'/5)',12,'helvetica','bold');line(focus.action);}
  line('Your five areas',15,'times');
  for(const row of result.rows)line(row.label+'   '+row.score+'/5   |   '+row.band,11);
  line('Your most consistent area',15,'times');
  line(result.balanced?'All five areas are level.':result.high.map(row=>row.label+' ('+row.score+'/5)').join(', ')+'.');
  if(result.high.length===1)line(result.high[0].strength);
  line(disclaimer,9);
  return pdf;
}
