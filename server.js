require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
if (process.env.NODE_ENV === 'development')
  console.log('Running in dev mode...');
if (process.env.NODE_ENV === 'production')
  console.log('Running in prod mode...');
