const express = require('express');

const app = express.Router();

const sql = require('../database')
const { Japi } = require('../index')
const ejs = require('ejs');
const path = require('path');

app.get("/", async (req, res) => {
  
  res.render("pages/home", {
    req, 
    res
  })
})

module.exports = app;