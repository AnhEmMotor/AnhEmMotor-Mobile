const fs = require('fs'); 
const data = JSON.parse(fs.readFileSync('eslint_report.json')); 
const errs = data.filter(d => d.errorCount > 0); 
errs.forEach(e => { 
  console.log(e.filePath); 
  e.messages.filter(m => m.severity === 2).forEach(m => console.log(`  ${m.line}:${m.column} ${m.message} (${m.ruleId})`)); 
});
