const fs = require('fs');
const path = require('path');

const files = [
  'd:/NexaSphere-NSOC/src/pages/recruitment/RecruitmentPage.jsx',
  'd:/NexaSphere-NSOC/src/pages/membership/MembershipPage.jsx',
];

files.forEach(f => {
  // Read raw bytes
  const raw = fs.readFileSync(f);

  // Check if it starts with UTF-8 BOM, strip if present
  let start = 0;
  if (raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF) start = 3;

  const payload = raw.slice(start);

  // Decode the raw bytes as if they were latin-1 (i.e., each byte = one char)
  // This reverses the double-encoding that happened
  const latin1str = payload.toString('binary');

  // Now re-encode properly as UTF-8
  const fixed = Buffer.from(latin1str, 'binary');

  // Verify the fix worked by checking for emoji range
  const asUtf8 = fixed.toString('utf8');
  const hasRealEmoji = /[\u{1F000}-\u{1FFFF}]/u.test(asUtf8);

  if (hasRealEmoji) {
    fs.writeFileSync(f, fixed);
    console.log(path.basename(f) + ': FIXED - real emoji detected');
  } else {
    // Try the reverse: the file might already be UTF-8 but garbled chars need latin1 decode
    const asLatin1again = Buffer.from(asUtf8, 'latin1');
    const attempt2 = asLatin1again.toString('utf8');
    const hasEmoji2 = /[\u{1F000}-\u{1FFFF}]/u.test(attempt2);
    if (hasEmoji2) {
      fs.writeFileSync(f, attempt2, 'utf8');
      console.log(path.basename(f) + ': FIXED (attempt2) - real emoji detected');
    } else {
      console.log(path.basename(f) + ': Could not fix - no emoji found after conversion');
      console.log('  First emoji area bytes:', [...fixed.slice(0, 200)].map(b => b.toString(16).padStart(2,'0')).join(' '));
    }
  }
});
