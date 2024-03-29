const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
const connectDB = require('./db/db');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const serviceProviderRouter = require('./routes/serviceProviderRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middleware
app.use(helmet());
// Rate limiting: preventing the same ip from making too many requests
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP',
});
app.use('/api', limiter);

// prints the route called, only in dev env, not prod
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser: reading body into req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());
//connect to DB

// Prevent parameter polution
//app.use(hpp()); // You can Specify fields for whitelisting in array when needed
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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/serviceProviders', serviceProviderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server`));
});

//console.log(process.env);
//reading of .env file happens once, in the server file

app.use(globalErrorHandler); // as end to the file as possible
module.exports = app;
