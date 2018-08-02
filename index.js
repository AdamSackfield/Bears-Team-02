const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const indexRoutes = require('./routes/index');
const founderRoutes = require('./routes/founderRoute');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const dev = app.get('env') !== 'production';

if(dev) {
	require('dotenv').config();
}
if(!dev) {
	app.disable('x-powered-by')
	app.use(morgan('common'))
	app.use(express.static(path.resolve(__dirname, 'client/build')))
}

/* Mongoose connection to mLab */
mongoose.Promise = global.Promise;
mongoose
.connect(process.env.MONGODB_URI.toString())
.then(() => console.log('Connected to mLab DB'))
.catch(err => console.log('Error connecting to mLab', err));

/* Express Middleware */
if(dev) {
	app.use(cors()); // Used for testing. Client is on another port to server.
	app.use(morgan('dev')); // Used for testing. Logs requests to the console.
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
// 	cookieSession({
// 		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
// 		keys: [keys.cookieKey],
// 	})
// );

// == Passport == //
require('./services/passport');
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/', indexRoutes);
app.use('/founders', founderRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
if(!dev) {
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
	})
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Serving on ${PORT}`);
});
