const express = require('express');
const passport = require('passport')
const app = express.Router();
const sql = require('../database')
const { bot, Japi } = require('../index.js')
app.get("/", (req, res) => {
  res.json({
    api: "working"
  })
})

app.get("/auth/callback", passport.authenticate('discord.js', { failureRedirect: '/' }), async function(req, res) {
  if(!req.user) return res.redirect("/");
  const data = await sql`
     SELECT * FROM users WHERE id=${req.user.id}
    `
  console.log(data)
  if (!data[0]) {
    const user = await sql`
       INSERT INTO users (id, username, avatar) VALUES (${req.user.id}, ${req.user.username}, ${req.user.avatar})
      `
  }
  res.redirect("/");
})

app.get("/user/info", (req, res) => {
  res.json(req.user || null)
})

app.get("/v1/posts", async (req, res) => {
  const data = await sql`
    SELECT * FROM posts ORDER BY fixed DESC, created_at DESC
  `
  res.json({
    data
  })
});

app.post("/v1/post", async (req, res) => {
  if (!req.user) return res.status(401).json({
    error: "Unauthorized"
  });
  const data = await sql`
    INSERT INTO posts (content, userId) VALUES (${req.body.content}, ${req.user.id})
  `
  res.status(200).json({
    message: "Your tweet has sent!"
  })
})

app.get("/v1/discord/user/:userId", async (req, res) => {
  // const user = bot.users.cache.get(req.params.userId);
  const user = await Japi.discord.getUser(req.params.userId);
  // console.log(user)
  if (!user) return res.json({});
  // console.log(user)
  res.json({
    data: user.data
  })
})

app.get("/v1/post/:id", async (req, res) => {
  const data = await sql`
   SELECT * FROM posts WHERE postid=${req.params.id}
  `
  if (!data) return res.status(404).json({
    error: "Post doesn't exists"
  });
  res.json(data);
})

app.post("/v1/post/:id/like", async (req, res) => {
  console.log(req.user)
  if (!req.user) return res.status(401).json({
    error: "Unauthorized"
  });

  const data = await sql`
   SELECT * FROM posts WHERE postid=${req.params.id}
  `
  if (!data) return res.status(404).json({
    error: "Post doesn't exists"
  });
  if (data[0].like_ids.includes(req.user.id)) {
    await sql`
     UPDATE posts SET like_ids = array_remove(like_ids, ${req.user.id})
    `
    return;
  }
  const post = await sql`
   UPDATE posts SET like_ids = like_ids || array[${req.user.id}] WHERE postid=${req.params.id}
  `

  res.status(200).json({
    message: "Liked tweet!"
  })
})

module.exports = app;