//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { sendFile } = require("express/lib/response");
const { resetWatchers } = require("nodemon/lib/monitor/watch");
const _ = require('lodash')
const mongoose = require('mongoose')
require('custom-env').env('.env.staging')
const homeStartingContent = "Welcome to my full stack dev journey!";
const aboutContent = "Hi, my name is Anthony Saoud. I have been in the Data industry for over 7 years, and I am pivotting into the development world one day at a time.";
const contactContent = "Feel free to drop me a note at a.saoud1@outlook.com to chat!";
mongoURL = "mongodb+srv://admin-asaoud:"+process.env.mongoPW+"@asaoud-cluster.hkfzrjb.mongodb.net/?retryWrites=true&w=majority"

//connect mongodb
mongoose.connect(mongoURL, {useNewURLParser:true})

//create document schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String
})

//create the mongoose model
const Blog = new mongoose.model("blog",blogSchema)

//test blog post
const blog1 = new Blog({
  title: "test1",
  content:"this is my first blog article on mongoose"
})

//blog1.save() 
//blog1 was successfully posted to mongodb

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var allPosts = []

app.get("/", function (req, res) {

  Blog.find({},function(err,foundBlogs) {
   if (!err) {
     console.log(foundBlogs)
     res.render("home.ejs", {
      homeStartingContent: homeStartingContent,
      allPosts: foundBlogs
    })
   }
  })
})


app.get("/about", function (req, res) {
  res.render("about.ejs", {
    aboutContent: aboutContent
  })
})

app.get("/contact", function (req, res) {
  res.render("contact.ejs", {
    contactContent: contactContent
  })
})

app.get("/compose", function (req, res) {
  res.render("compose.ejs")
})

app.post("/compose", function (req, res) {
  const newBlog = new Blog({
    title: req.body.postTitle,
    content: req.body.postContent
  })
  
  newBlog.save() 
  res.redirect("/")
})


app.get("/posts/:topic", function (req, res) {
  console.log(req.params.topic)

  const requestedID = req.params.topic

  Blog.find({_id: requestedID},function(err,result){
    if(!err) {
      console.log(result[0].title)
      console.log(result[0].content)

      res.render("post.ejs", {
              title: result[0].title,
              content: result[0].content
            })
    }
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
