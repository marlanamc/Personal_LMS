const fs = require('fs');
const path = require('path');

// Mapping of weeks to their new verbs
const weekVerbMappings = {
  '25': ['stand', 'choose', 'report', 'document', 'contact'],
  '26': ['chat', 'discuss', 'mention', 'ask', 'talk'],
  '27': ['resolve', 'address', 'solve', 'handle', 'suggest'],
  '29': ['feel', 'hurt', 'see', 'examine', 'prescribe'],
  '30': ['take', 'swallow', 'use', 'store', 'refill'],
  '31': ['book', 'cancel', 'reschedule', 'register', 'update'],
  '32': ['prepare', 'plan', 'cook', 'avoid', 'consume'],
  '33': ['mix', 'heat', 'rest', 'apply', 'try'],
  '34': ['stretch', 'breathe', 'exercise', 'practice', 'improve'],
  '35': ['teach', 'learn', 'grow', 'achieve', 'succeed']
};

const classObjectivesDir = path.join(__dirname, '..', 'class_uploads', 'Class-Objectives');

Object.entries(weekVerbMappings).forEach(([weekNum, verbs]) => {
  const fileName = `week${weekNum}-*.html`;
  const files = fs.readdirSync(classObjectivesDir).filter(f => {
    const regex = new RegExp(`^week${weekNum}-.*\\.html$`);
    return regex.test(f);
  });

  if (files.length === 0) {
    console.log(`⚠️  No file found for week ${weekNum}`);
    return;
  }

  const filePath = path.join(classObjectivesDir, files[0]);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find and replace the tbody section with verb rows
  const tbodyRegex = /<tbody>[\s\S]*?<\/tbody>/;
  const match = content.match(tbodyRegex);

  if (!match) {
    console.log(`⚠️  Could not find tbody in week ${weekNum}`);
    return;
  }

  // Generate new tbody with new verbs
  const newTbody = `<tbody>
${verbs.map(verb => `                            <tr>
                                <td class="v1">${verb}</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                                <td>&nbsp;</td>
                            </tr>`).join('\n')}
                        </tbody>`;

  content = content.replace(tbodyRegex, newTbody);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated week ${weekNum}: ${files[0]}`);
});

console.log('\n✨ All class objectives updated!');
