//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/Restful_wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//request targeting all article
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundItem) {
      if (!err) {
        res.send(foundItem);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        console.log("SUcessfully Saved New Article");
      } else {
        console.log(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("sucessfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//request targeting specific article

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, founditem) {
        if (founditem) {
          res.send(founditem);
        } else {
          res.send("no article found");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Sucessfully updated ");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Sucessfully updated article");
        } else {
          res.send("Error updating article");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Deleted sucessfully");
      } else {
        res.send("Error occcured while deleting");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
