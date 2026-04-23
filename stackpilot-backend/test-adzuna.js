const https = require('https');

const url = 'https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=65e2f5f4&app_key=43121507249ed0827cd6d52fc387046b&what=Software%20Engineer&results_per_page=5&content_type=application/json&max_days_old=7';

https.get(url, { headers: { 'User-Agent': 'StackPilot/1.0' } }, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.log('Data:', data);
      } else {
        const json = JSON.parse(data);
        console.log('Dates:', json.results.map(j => j.created));
      }
    } catch (e) {
      console.log('Error parsing JSON. Raw data:', data.substring(0, 500));
    }
  });
});
