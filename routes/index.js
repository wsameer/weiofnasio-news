var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/** @type {model} Load Posts model */
var Post = mongoose.model('Post');

/** @type {model} Load Comments model */
var Comment = mongoose.model('Comment');

/* a GET route to show the home page. */
router.get('/', function(req, res, next) {
  
  /** Render the index.ejs file from ./views */
  res.render('index', {
    title: 'Weionasio News',
    subtitle: ' - the best news app in the world!'
  });
});

/** REST Routes */

/** a GET route for retrieving posts. */
router.get('/posts', function(req, res, next) {
  Post
    .find()
    .then(function (allPosts) {
      res.json(allPosts);
    }, function(err) {
      next(err);
    });
});

/** a POST route for creating a new post */
router.post('/posts', function (req, res, next) {
  var post = new Post(req.body);

  post.save(function (err, post) {
    if (err) {
      return next(err);
    }
    console.log('New post added to database.');
    res.json(post);
  });
});

/** a route for preloading post objects */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return next(new Error('Can\'t find post'));
    }

    req.post = post;
    return next();
  });
});

/** a route for preloading comment objects */
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return next(new Error('Can\'t find comment'));
    }

    req.comment = comment;
    return next();
  });
});

/** a GET route for returning a single post. */
router.get('/posts/:post', function (req, res) {
  req.post.populate('comments', function (err, post) {
    res.json(post);
  });
});

/** a DELETE request to delete post */
router.delete('/posts/:post', function(req, res) {
  req
    .post
    .comments
    .forEach(function(id) {
      Comment.remove({
        _id: id
      }, function(err) {
        if (err) { return next(err)}
      });
    })
    
    Post.remove({
      _id: req.params.post
    }, function(err, post) {
      if (err) { return next(err); }
    
      /** get and return all the posts after you delete one */
      Post.find(function(err, posts) {
        if (err) { return next(err); }
        
        res.json(posts);
      });
  });
});

/** a PUT request to upvote a post */
router.put('/posts/:post/upvote', function(req, res, next) {
  req
    .post
    .upvote(function(err, post) {
      if (err) {
        return next(err);
      }
      res.json(post);
  });
});

/** a PUT request to downvote a post */
router.put('/posts/:post/downvote', function(req, res, next) {
  req
    .post
    .downvote(function(err, post) {
      if (err) {
        return next(err);
      }
      res.json(post);
  });
});

/** a PUT request to Upvote comment */
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
  req
    .comment
    .upvoteComment(function (err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
  });
});

/** a PUT request to downvote a comment */
router.put('/posts/:post/comments/:comment/downvote', function(req, res, next) {
  req
    .comment
    .downvoteComment(function(err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
  });
});

/** a POST request to add new comment */
router.post('/posts/:post/comments', function (req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function (err, comment) {
    if (err) {
      return next(err);
    }

    req.post.comments.push(comment);
    req.post.save(function (err, post) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    });
  });
});

module.exports = router;