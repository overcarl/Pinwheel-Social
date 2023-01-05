const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
const session = require('express-session');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const fs = require('node:fs');
const expressLayouts = require('express-ejs-layouts')
const ejs = require('ejs');
const japirest = require('japi.rest');
const japiRest = new japirest(process.env.JapiKey)

module.exports.Japi = japiRest;

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/src/locale/{{lng}}/{{ns}}.json'
    },
    fallbackLng: 'en',
    preload: ['en', 'pt-BR'],
    ns: ['common', '404', '500']
  });

app.use(i18nextMiddleware.handle(i18next));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');

app.use(expressLayouts)

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new Strategy({
  clientID: process.env.ClientID,
  clientSecret: process.env.ClientSecret,
  callbackURL: "/api/auth/callback",
  scope: [
    "identify"
  ]
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    return done(null, profile);
  })
}))

app.use(session({
  secret: "PinwheelSocialIsCool",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", require('./api/home'))
app.use("/api", require('./api/index'))

app.listen(3000, () => {
  console.log('server started');
});
