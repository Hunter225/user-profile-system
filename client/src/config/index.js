module.exports = {
  apiBaseURL: process.env.API_BASE_URL || 'http://localhost:9000/api',
  webBaseURL: process.env.WEB_BASE_URL || 'http://localhost:3000',
  timeout: process.env.TIME_OUT || 15000
};
