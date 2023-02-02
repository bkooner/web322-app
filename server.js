/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhawanjot Singh Kooner Student ID: 167834217 Date: 2023-02-02
*
*  Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const app = express();

// Use express.static middleware to serve static files
app.use(express.static('public'));

// Route "/" redirects to "/about"
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Route "/about" returns the about.html file from the views folder
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route "/blog" returns the blog.html file from the views folder
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname,'blog-service.js'));
});

// Route "/categories" returns the categories.html file from the views folder
app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, 'data','categories.json'));
});

// Route "/posts" returns the posts.html file from the views folder
app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'data','posts.json'));
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server on process.env.PORT || 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Express http server listening on port ${port}`);
});
