//jshint esversion:6


// there is no node modules folder for this project - SOP for anything obtained from github; to install dependencies locally, just type npm i in the terminal, and it will parse the package.json for the necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

// create new mongodb database
mongoose.connect("mongodb://localhost:27017/blogDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// schema
const postsSchema = {
  title: String,
  body: String,
  teaser: String,
}

// model
const Post = mongoose.model("Post", postsSchema);


app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    res.render("home", {homeStartingContent: homeStartingContent, posts: foundPosts});
  });


})

app.get("/compose", function(req, res) {
  res.render("compose");
})

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.title,
    body: req.body.newPost,
    teaser: req.body.newPost.substring(0,99) + "...",
  });

  // save the post and refresh home page to display most recent post
  post.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
})

app.get("/contact", function(req, res) {
  res.render("contact");
})
// express routing parameters; uses whatever comes after : to decide what to do
app.get("/posts/:postId", function(req, res) {
  const requested =(req.params.postId);
  Post.findOne({_id: requested}, function(err, post) {
    if(err){
      console.log(err);
    } else {
      console.log(post);
      res.render("post", {post: post});
    };

  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
