const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const fs = require('node:fs');
const expressLayouts = require('express-ejs-layouts')

i18next
.use(Backend)
.use(i18nextMiddleware.LanguageDetector)
.init({
  backend: {
    loadPath: __dirname + '/src/locale/{{lng}}/{{ns}}.json'
  },
  fallbackLng: 'en',
  preload: ['en'],
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

app.use("/", require('./api/home'))
app.use("/api", require('./api/index'))

app.listen(3000, () => {
  console.log('server started');
});
