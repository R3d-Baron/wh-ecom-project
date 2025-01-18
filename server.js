require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./src/config/connect');

const Emitter = require('events');

// Function to start the server
function startServer() {
  app.listen(process.env.PORT, () => {
    if (process.env.APP_ENV == "production") {
      console.log(`server is working on ${process.env.APP_URL}`);
    } else {
      console.log(`server is working on http://localhost:` + process.env.PORT + "/");
    }
  });
}

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Uncaught Rejection`);
  
    server.close(() => {
      startServer();
    });
  });
  
  connectDatabase();
  
  // Event emitter
  const eventEmitter = new Emitter();
  app.set('eventEmitter', eventEmitter);
  
  process.env.TZ = 'Asia/Kolkata';
  
  
  const server = app.listen(process.env.PORT, () => {
    if (process.env.APP_ENV == "production") {
      console.log(`server is working on ${process.env.APP_URL}`);
    } else {
      console.log(`server is working on http://localhost:` + process.env.PORT + "/");
    }
  });
  
  process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);
  
    // Close the server gracefully
    server.close(() => {
      console.log('Server closed. Restarting...');
  
      // Restart the server after it's closed
      startServer();
    });
  });