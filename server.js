/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhawanjot Singh Kooner Student ID: 167834217 Date: 2023-02-02
*
*  Online (Cyclic) Link: https://cautious-buckle-colt.cyclic.app
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const app = express();
const blog = require('./blog-service.js');

app.use(express.static(path.join(__dirname, 'public'))); 
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.redirect("/about");
});
app.get('/posts/add', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addPost.html'));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

blog.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart());
})
.catch (() => {
    console.log('Error');
});

app.get("/posts", (req, res) => {
  blog.getAllPosts()
    .then(data => res.send(data))
    .catch(err => res.send(err.message));
});

app.get("/blog", (req, res) => {
  blog.getPublishedPosts()
    .then(data => res.send(data))
    .catch(err => res.send(err.message));
});

app.get("/categories", (req, res) => {
  blog.getCategories()
    .then(data => res.send(data))
    .catch(err => res.send(err.message));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "pageNotFound.html"));
});
