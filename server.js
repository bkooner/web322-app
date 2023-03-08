/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhawanjot Singh Kooner Student ID: 167834217 Date: 2023-03-04
*
*  Online (Cyclic) Link: https://cautious-buckle-colt.cyclic.app
*
********************************************************************************/ 

const express = require("express");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require("path");
const app = express();
const exphbs = require('express-handlebars');
const stripJs = require('strip-js');
const blog = require('./blog-service.js');

cloudinary.config({
  cloud_name: 'degkhmpl4',
  api_key: '622939466967177',
  api_secret: '6fLZp1wP7VicO44VJ-jjgDybO_8',
  secure: true
});

const upload = multer();

app.engine('.hbs',exphbs.engine({
  extname:'.hbs',
  helpers:{
      navLink: function(url, options){
        return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    },
    safeHTML: function(context){
      return stripJs(context);
    }  
  }
}));

app.set('view engine', '.hbs');

app.use(express.static("public"));
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res)=> {
  res.redirect("/blog");
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get("/posts", (req, res) => {
  let queryForPost = null;

    if (req.query.category) {
      queryForPost = blog.getPostsByCategory(req.query.category);
    } else if (req.query.minDate) {
      queryForPost = blog.getPostsByMinDate(req.query.minDate);
    } else {
      queryForPost = blog.getAllPosts();
    }

    queryForPost.then(data => {
        res.render('posts', { posts: data });
    }).catch(err => {
      res.render("posts", {message: "no results"});
    })
  });

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
              if (result) {
                  resolve(result);
              } else {
                  reject(error);
              }
            }
          );
  
          streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
  
  async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
  }
  
  upload(req).then((uploaded)=>{
      req.body.featureImage = uploaded.url;
      
      blog.addPost(req.body).then(()=>{
      res.redirect("/posts");
      
    }).catch(err=>{
        res.status(500).send(err);
    })
  }).catch((err) => {
    res.send(err);
  });

});

app.get('/posts/add', (req, res) => {
  res.render('addPost'); 
});

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});


app.get("/posts/add", async (req, res) => {
  try {
    const postData = req.body;
    await blog.addPost(postData);
    res.redirect('/blog');
  } catch (error) {
    res.render({ message: err } );
  }
});

blog.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart());
})
.catch (() => {
    console.log('Error');
});

app.get('/blog', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blog.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blog.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // get the latest post from the front of the list (element 0)
      let post = posts[0]; 

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blog.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blog.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blog.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the post by "id"
      viewData.post = await blog.getPostById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blog.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})
});

app.get("/categories", (req, res) => {
  blog.getCategories()
    .then(data => res.render("categories", {categories: data}))
    .catch(err => res.render("categories", {message: "no results"}));
});


app.get('/post/:value', (req, res) => {
  blog.getPostById(req.params.id)
    .then(data => {
      res.json(data);
    }).catch(err => {
      res.status(500).send(err);
    });
});

app.use((req, res) => {
  res.status(404).render('pageNotFound');
});