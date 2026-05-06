const fs = require('fs');
const files = [
  'd:/NexaSphere-NSOC/src/pages/recruitment/RecruitmentPage.jsx',
  'd:/NexaSphere-NSOC/src/pages/membership/MembershipPage.jsx'
];

files.forEach(f => {
  const rawBytes = fs.readFileSync(f);
  const asLatin1 = rawBytes.toString('binary');
  const backToUtf8 = Buffer.from(asLatin1, 'binary');
  const correct = backToUtf8.toString('utf8');
  fs.writeFileSync(f, correct, { encoding: 'utf8' });

  const lines = correct.split('\n');
  let shown = 0;
  lines.forEach((l, i) => {
    if (l.includes("sec('") && shown < 3) {
      const preview = JSON.stringify(l.trim().slice(0, 55));
      console.log('L' + (i + 1) + ': ' + preview);
      shown++;
    }
  });
  console.log('Done: ' + require('path').basename(f));
});
