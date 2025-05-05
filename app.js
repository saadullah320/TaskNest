const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');
const todolistRoutes = require('./routes/todolistRoutes');

const db = require('./config/mongodbconnection');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.regerrors = req.flash('registererrors'); // make it available in views
    res.locals.loginerrors = req.flash('loginerrors'); // make it available in views
    res.locals.addtaskerrors = req.flash('addtaskerrors'); // make it available in views
    res.locals.success = req.flash('success');
    next();
});

app.use('/users',userRoutes);
app.use('/api', apiRoutes);
app.use('/todolist', todolistRoutes);

app.get('/', (req, res) => {
    res.redirect('/users/');
});
  


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});