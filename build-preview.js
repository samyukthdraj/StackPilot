const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'stackpilot-backend/src/email/templates');
const outPath = path.join(__dirname, 'stackpilot-frontend/public/email-preview.html');

let welcome = fs.readFileSync(path.join(templatesDir, 'welcome.hbs'), 'utf8')
  .replace(/{{name}}/g, 'Samyukth').replace(/{{loginUrl}}/g, 'http://localhost:3000/login');

let jobMatches = fs.readFileSync(path.join(templatesDir, 'job-matches.hbs'), 'utf8')
  .replace(/{{name}}/g, 'Samyukth')
  .replace(/{{matches\.length}}/g, '1')
  .replace(/{{dashboardUrl}}/g, 'http://localhost:3000/dashboard')
  .replace(/{{#each matches}}[\s\S]*?{{this\.title}}[\s\S]*?{{this\.company}}[\s\S]*?{{this\.location}}[\s\S]*?{{this\.score}}[\s\S]*?{{this\.matchedSkills}}[\s\S]*?{{#if this\.missingSkills}}[\s\S]*?{{this\.missingSkills}}[\s\S]*?{{\/if}}[\s\S]*?{{this\.url}}[\s\S]*?{{\/each}}/g, `
          <div class='job-card'>
            <h3 style='margin: 0 0 5px 0;'>Senior Software Engineer</h3>
            <p style='margin: 0 0 10px 0; color: #666;'>StackPilot Inc • Remote</p>
            <div style='margin-bottom: 10px;'>
              <span class='badge'>Match Score: 98%</span>
            </div>
            <p><strong>Matched Skills:</strong> React, Node.js, TypeScript, AI</p>
            <a href='#' style='color: #667eea; text-decoration: none;'>View Job →</a>
          </div>
  `);

let dailyDigest = fs.readFileSync(path.join(templatesDir, 'daily-digest.hbs'), 'utf8')
  .replace(/{{name}}/g, 'Samyukth')
  .replace(/{{newJobs}}/g, '14')
  .replace(/{{savedJobs}}/g, '3')
  .replace(/{{dashboardUrl}}/g, 'http://localhost:3000/dashboard')
  .replace(/{{#each topMatches}}[\s\S]*?{{this\.title}}[\s\S]*?{{this\.company}}[\s\S]*?{{this\.score}}[\s\S]*?{{\/each}}/g, `
            <li>Staff Frontend Engineer at Vercel - 99% match</li>
            <li>Senior Backend Developer at Stripe - 94% match</li>
  `);

function escapeHtml(html) {
  return html.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

const html = `<!DOCTYPE html>
<html>
<head>
  <title>StackPilot Email Previews</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #e0e0e0; padding: 40px; margin: 0; }
    h1 { text-align: center; color: #333; margin-bottom: 40px; }
    .email-container { max-width: 800px; margin: 0 auto 60px auto; }
    .email-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #555; }
    iframe { width: 100%; height: 600px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; background: #fff; }
  </style>
</head>
<body>
  <h1>Live Email Templates Preview</h1>
  
  <div class="email-container">
    <div class="email-title">1. Welcome Email (Premium Dark Theme)</div>
    <iframe srcdoc="${escapeHtml(welcome)}"></iframe>
  </div>

  <div class="email-container">
    <div class="email-title">2. Job Matches Email</div>
    <iframe srcdoc="${escapeHtml(jobMatches)}"></iframe>
  </div>

  <div class="email-container">
    <div class="email-title">3. Daily Digest Email</div>
    <iframe srcdoc="${escapeHtml(dailyDigest)}"></iframe>
  </div>
</body>
</html>`;

fs.writeFileSync(outPath, html);
console.log('Preview generated perfectly!');
