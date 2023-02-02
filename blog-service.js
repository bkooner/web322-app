const express = require('express');
const fs = require('fs');
const app = express();

let posts = [];
let categories = [];

fs.readFile('./data/posts.json', 'utf-8', (err, data) => {
  if (err) throw err;
  posts = JSON.parse(data);
});

fs.readFile('./data/categories.json', 'utf-8', (err, data) => {
  if (err) throw err;
  categories = JSON.parse(data);
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

app.get('/blog', (req, res) => {
  const publishedPosts = posts.filter(post => post.published === true);
  res.json(publishedPosts);
});

app.get('/data/posts.json', (req, res) => {
  res.json(posts);
});

app.get('/data/categories.json', (req, res) => {
  res.json(categories);
});

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Express http server listening on ${server.address().port}`);
});
