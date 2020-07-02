/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const http = require('http');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err, err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('DB connection successful');
  });

const port = process.env.PORT || 3001;

// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// const httpServer = new http.Server(server);
// const io = socketIO(httpServer);

const server = new http.Server(app);
const io = socketIO(server);

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const global = io => {
  io.on('connection', (socket) => {
    console.log('connected');
    socket.on('refresh', () => {
      io.emit('refreshPage', {});
    });
  });
}

global(io);

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED! Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
