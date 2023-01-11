const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-discord.js').Strategy;
const session = require('express-session');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const fs = require('node:fs');
const expressLayouts = require('express-ejs-layouts')
const ejs = require('ejs');
const japirest = require('japi.rest');
const japiRest = new japirest(process.env.JapiKey)
const Discord = require('discord.js')

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildPresences
  ]
})
const sql = require('./database')

client.on("ready", async () => {
  const data = await sql`
    SELECT * FROM posts
  `
  console.log(data.length)
  client.user.setActivity(`${data.length} posts`, { type: Discord.ActivityType.Watching })
})

module.exports.bot = client;
module.exports.Japi = japiRest;

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/src/locale/{{lng}}/{{ns}}.json'
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    preload: ['en', "pt-br"],
    ns: ['common', 'accessibility', '404', '500']
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
}, async function(accessToken, refreshToken, profile, done) {
  process.nextTick(async function() {
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

app.use("/api", require('./api/index'))
app.use("/", require('./api/home'))
app.listen(3000)

client.login(process.env.botToken);