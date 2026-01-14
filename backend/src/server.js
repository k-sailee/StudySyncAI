import dotenv from "dotenv";
dotenv.config();

console.log('Starting server...');
console.log('PORT from env:', process.env.PORT);

import app from "./app.js";
console.log('App imported successfully');

const PORT = process.env.PORT || 5000;
console.log('Using port:', PORT);

console.log('Calling app.listen...');
const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log('Server started successfully');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('listening', () => {
  console.log('Server is now listening');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
