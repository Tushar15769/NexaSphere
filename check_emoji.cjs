const fs = require('fs');
const b = fs.readFileSync('d:/NexaSphere-NSOC/src/pages/recruitment/RecruitmentPage.jsx');
const s = b.toString('utf8');
const idx = s.indexOf("sec('");
if (idx >= 0) {
  const emoji = s.slice(idx + 5, idx + 12);
  const codepoints = [...emoji].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase());
  console.log('Emoji codepoints:', codepoints);
  console.log('Is brain emoji (U+1F9E0):', codepoints[0] === 'U+1F9E0');
}
