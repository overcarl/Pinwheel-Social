const express = require('express');

const app = express.Router();

const sql = require('../database')
const { bot } = require('../index')
const ejs = require('ejs');
const path = require('path');

app.get("/", async (req, res) => {
  
  res.render("pages/home", {
    req, 
    res
  })
})

app.get("/profile/:id", async (req, res) => {
  const data = await sql`
   SELECT * FROM users WHERE id=${req.params.id}
  `
  res.render("pages/profile/user.ejs", {
    req, 
    res,
    data: data[0],
    user: bot.users.cache.get(req.params.id)
  })
})

app.get("/post/:id", async (req, res) => {
  const data = await sql`
   SELECT * FROM posts WHERE postid=${req.params.id}
  `
  if(!data) return res.status(404);
  res.render("pages/post", {
    req, 
    res,
    data: data[0]
  })
})

module.exports = app;