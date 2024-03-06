const express = require('express');
const morgan = require('morgan');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
const connectDB = require('./db/db');

const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// prints the route called, only in dev env, not prod
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//connect to DB
connectDB();

// Cookie sessions, not needed yet
// app.use(cookieParser());

// app.use(
//   session({
//     secret: 'HandiWork Random String',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       cookie: { maxAge: new Date(Date.now() + 3600000) },
//     }),
//   })
// );
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server`));
});


//console.log(process.env);
//reading of .env file happens once, in the server file

app.use(globalErrorHandler); // as end to the file as possible
module.exports = app;
