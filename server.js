const express = require("express");
const path = require("path");
const { initialize, getAllPosts, getCategories,getPublishedPosts } = require("./blog-service.js");

const app = express();

// Use express.static middleware for static files
app.use(express.static(path.join(__dirname, 'public'))); 

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/blog", (req, res) => {
  getPublishedPosts()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message));
});

app.get("/posts.json", (req, res) => {
  getAllPosts()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message));
});

app.get("/categories.json", (req, res) => {
  getCategories()
    .then(data => res.send(data))
    .catch(err => res.status(500).send(err.message));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "pageNotFound.html"));
});

initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Express http server listening on: ${HTTP_PORT}`);
  });
});
