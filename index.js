const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-statergy');
const passportGoogle = require('./config/passport-google-oauth2-stratergy');

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));

//make the uploads path available for the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//extract style and script from sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(expressLayouts);

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    //Todo Change the secret before deployment in production mode
    secret:'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1/codeial_development',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));


app.listen(port, (err) => {
    if(err){console.log(`Error in running server: ${err}`);}

    console.log(`Server is running on: ${port}`);
});