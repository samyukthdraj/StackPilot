const http = require('http');

http.get('http://localhost:8080/jobs?country=us&days=7', (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Data:', data.substring(0, 1000)));
}).on('error', (err) => console.error('Error:', err.message));
