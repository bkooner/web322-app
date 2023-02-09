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
const fs = require('fs');
const path = require("path");
let posts = [];
let categories = [];

function initialize () {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "data", "posts.json"), 'utf8', (err, data) => {
      if (err) {
        reject(new Error("File Not Read"));
      } else {
        posts = JSON.parse(data);
        fs.readFile(path.join(__dirname, "data", "categories.json"), 'utf8', (err, categoriesData) => {
          if (err) {
            reject(new Error("File Not Read"));
          } else {
            categories = JSON.parse(categoriesData);
            resolve();
          }
        });
      }
    });
  });
}
function getAllPosts () {
  return new Promise((resolve, reject) => {
    if (posts.length === 0) {
      reject("No data returned");
    } else {
      resolve(posts);
    }
  })
}
function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    let publishedPosts = posts.filter((post) => post.published === true);
    
    if (publishedPosts.length > 0) {
      resolve(publishedPosts);
    } else {
      reject("No data returned");
    }
  })    
}
function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("No data returned");
    } else {
      resolve(categories);
    }
  })
}

 function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
      let filteredPosts = posts.filter(post => post.category == category);

      if (filteredPosts.length == 0) {
          reject("no results found")
      } else {
          resolve(filteredPosts);
      }
  });
}

 function getPostsByMinDate (minDateStr) {
  return new Promise((resolve, reject) => {
      let filteredPosts = posts.filter(post => (new Date(post.postDate)) >= (new Date(minDateStr)))

      if (filteredPosts.length == 0) {
          reject("no results found")
      } else {
          resolve(filteredPosts);
      }
  });
}

 function getPostById(id) {
  return new Promise((resolve, reject) => {
      let foundPost = posts.find(post => post.id == id);

      if (foundPost) {
          resolve(foundPost);
      } else {
          reject("no result found");
      }
  });
}


 function addPost(postData) {
  return new Promise((resolve, reject) => {
      postData.published = postData.published ? true : false;
      postData.id = posts.length + 1;
      posts.push(postData);
      resolve();
  });
}


module.exports = { initialize, getAllPosts,getPublishedPosts, getCategories, getPostsByMinDate ,addPost,getPostsByCategory,getPostById};
