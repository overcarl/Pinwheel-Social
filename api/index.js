const express = require('express');
const passport = require('passport')
const app = express.Router();

app.get("/", (req,res) => {
  res.json({
    api: "working"
  })
})

app.get("/auth/callback", passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { 
  res.redirect("/");
})

app.get("/user/info", (req, res) => {
  res.json(req.user||undefined)
})

module.exports = app;