require('dotenv').config();
const express = require('express');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const MongoStore = require('connect-mongo');
const connectDB = require('./db/db');

const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
