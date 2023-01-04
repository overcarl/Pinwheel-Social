const express = require('express');

const app = express.Router();

app.get("/", (req,res) => {
  res.json({
    api: "working"
  })
})

module.exports = app;