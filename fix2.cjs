const fs = require('fs');

function fix(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Replace each corrupted emoji with the correct one
  // Using literal escaped unicode in the replacement targets
  const fixes = [
    ['\u00f0\u0178\u00a7\u00a0', '\ud83e\udde0'],  // 🧠 brain
    ['\u00f0\u0178\u201d\u00b9', '\ud83d\udd39'],  // 🔹
    ['\u00e2\u02dc\u0081\u00ef\u00b8\u008f', '\u2601\ufe0f'],  // ☁️
    ['\u00f0\u0178\u00a4\u2013', '\ud83e\udd16'],  // 🤖
    ['\u00f0\u0178\u201c\u00b1', '\ud83d\udcf1'],  // 📱
    ['\u00f0\u0178\u0152\u0090', '\ud83c\udf10'],  // 🌐
    ['\u00f0\u0178\u201d\u0090', '\ud83d\udd10'],  // 🔐
    ['\u00f0\u0178\u017d\u00a8', '\ud83c\udfa8'],  // 🎨
    ['\u00f0\u0178\u00a7\u00a9', '\ud83e\udde9'],  // 🧩
    ['\u00f0\u0178\u017d\u00a5', '\ud83c\udfa5'],  // 🎥
    ['\u00f0\u0178\u201c\u2039', '\ud83d\udccb'],  // 📋
    ['\u00f0\u0178\u201c\u2026', '\ud83d\udcc5'],  // 📅
    ['\u00f0\u0178\u201c\u00a2', '\ud83d\udce2'],  // 📢
    ['\u00e2\u0153\u008d\u00ef\u00b8\u008f', '\u270d\ufe0f'],  // ✍️
    ['\u00f0\u0178\u017d\u201c', '\ud83c\udf0d'],  // 🌍
    ['\u00f0\u0178\u2018\u00a5', '\ud83d\ude4b'],  // 🙋
    ['\u00f0\u0178\u017e\u2020', '\ud83c\udfaf'],  // 🎯
    ['\u00f0\u0178\u2018\u00a5', '\ud83d\ude4b'],  // 🙋
    ['\u00e2\u009a\u00a0\u00ef\u00b8\u008f', '\u26a0\ufe0f'],  // ⚠️
    ['\u00f0\u0178\u201d\u008e', '\ud83d\udd0e'],  // 🔎
    ['\u00e2\u009c\u0095', '\u2715'],              // ✕
    ['\u00e2\u009c\u201c ', '\u2714 '],             // ✔ 
    ['\u00f0\u0178\u2018\u00a5', '\ud83d\ude4b'],  // 🙋
    ['\u00f0\u0178\u2019\u00a5', '\ud83d\udcaa'],  // 💪
    ['\u00e2\u009d\u00a4\u00ef\u00b8\u008f', '\u2764\ufe0f'],  // ❤️
    // MembershipPage specific
    ['\u00f0\u0178\u201c\u00a3', '\ud83d\udce3'],  // 📣
    ['\u00f0\u0178\u2019\u00a4', '\ud83d\udca1'],  // 💡
    ['\u00f0\u0178\u0192\u0090', '\ud83c\udf90'],  // 🎐
    ['\u00f0\u0178\u201d\u008a', '\ud83d\udd0a'],  // 🔊
    ['\u00f0\u0178\u00a7\u0090', '\ud83e\uddd0'],  // 🧐
  ];
  
  let changed = 0;
  fixes.forEach(([from, to]) => {
    if (c.includes(from)) {
      c = c.split(from).join(to);
      changed++;
    }
  });
  
  fs.writeFileSync(file, c, 'utf8');
  console.log(require('path').basename(file) + ': ' + changed + ' replacements');
}

fix('d:/NexaSphere-NSOC/src/pages/recruitment/RecruitmentPage.jsx');
fix('d:/NexaSphere-NSOC/src/pages/membership/MembershipPage.jsx');
