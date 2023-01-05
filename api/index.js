const express = require('express');
const passport = require('passport')
const app = express.Router();
const sql = require('../database')

app.get("/", (req,res) => {
  res.json({
    api: "working"
  })
})

app.get("/auth/callback", passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { 
  res.redirect("/");
})

app.get("/user/info", (req, res) => {
  res.json(req.user||null)
})

app.get("/v1/posts", async(req,res) => {
  const data = await sql`
    SELECT * FROM posts ORDER BY created_at DESC
  `
  res.json({
    data
  })
});

app.post("/v1/post", async(req, res) => {
  if(!req.user) return res.status(401).json({
    error: "Unauthorized"
  });
  const data = await sql`
    INSERT INTO posts (content, userId) VALUES (${req.body.content}, ${req.user.id})
  `
  res.status(200).json({
    message: "Your tweet has sent!"
  })
})

module.exports = app;