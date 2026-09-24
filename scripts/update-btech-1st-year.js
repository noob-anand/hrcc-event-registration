const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, '../src/app/page.tsx'),
  path.join(__dirname, '../src/components/RegistrationForm.tsx'),
  path.join(__dirname, '../src/components/EditStudentModal.tsx')
];

const targetStr = "return ['2nd Year', '3rd Year', '4th Year'];";
const replaceStr = "return ['1st Year', '2nd Year', '3rd Year', '4th Year'];";

let modifiedCount = 0;

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(targetStr)) {
      content = content.replace(targetStr, replaceStr);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully updated ${filePath}`);
      modifiedCount++;
    } else {
      console.log(`Target string already updated or not found in ${filePath}`);
    }
  } else {
    console.error(`File not found: ${filePath}`);
  }
});

console.log(`Update complete. ${modifiedCount} file(s) updated.`);
