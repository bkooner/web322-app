/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bhawanjot Singh Kooner Student ID: 167834217 Date: 2023-02-02
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
const blog = require('./blog-service.js');

cloudinary.config({
  cloud_name: 'degkhmpl4',
  api_key: '622939466967177',
  api_secret: '6fLZp1wP7VicO44VJ-jjgDybO_8',
  secure: true
});

const upload = multer();

app.use(express.static(path.join(__dirname, 'public'))); 
const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.redirect("/about");
});
app.get('/posts/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views','addPost.html'));
});

app.get("/posts", (req, res) => {
  let queryPromise = null;

    if (req.query.category) {
        queryPromise = blog.getPostsByCategory(req.query.category);
    } else if (req.query.minDate) {
        queryPromise = blog.getPostsByMinDate(req.query.minDate);
    } else {
        queryPromise = blog.getAllPosts();
    }

    queryPromise.then(data => {
        //res.render('posts', { posts: data });
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    })
  });

  

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  
  if (req.file) {
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
  });
  } else {
    addingPost("");
  }
  function addingPost(postingImage) {
    req.body.featureImage = postingImage;
    if (!req.body.published) {
      req.body.published = false;
    } else {
      req.body.published = true;
    }
    req.body.id = blog.posts.length + 1;
    blog.addPost(req.body).then(() => {
      res.redirect("/posts");
    }).catch((err) => {
      res.status(500).send(err);
    })
  }
});

app.post('/posts/add', (req, res) => {
  const postData = req.body;
  blog.addPost(postData)
    .then(() => {
      res.redirect("/posts");
    })
    .catch((err) => {
      res.status(500).send("Error adding post: " + err.message);
    });
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

app.get('/post/:id', (req, res) => {
  blog.getPostById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

