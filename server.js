require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION, shutting down...');
  console.log(err);
  process.exit(1);
});
const app = require('./app');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
if (process.env.NODE_ENV === 'development')
  console.log('Running in dev mode...');
if (process.env.NODE_ENV === 'production')
  console.log('Running in prod mode...');

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
