const express = require('express');

const app = express.Router();

app.get("/", (req,res) => {
  res.render("pages/home", {
    req, res
  })
})

module.exports = app;