var app = angular.module('weiofnasioNews', ['ui.router']);

// ui.router config
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
        
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        resolve: {
          postPromise: ['posts', function(posts) {
            return posts.getAll();
          }]
        }
      })
      
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsController',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams,posts) {
            return posts.get($stateParams.id);
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);

/** Main Controller */
app.controller('MainController', [
    '$scope'
  , 'posts'
  , function($scope, posts) {

    $scope.heading = 'Weiofnasio News';
    $scope.subtitle = 'The best news app on the planet!';
    $scope.posts = posts.posts;

    $scope.deletePost = function (currentPost) {
      posts.delete(currentPost);
    };

    $scope.toggleUpvotes = function(currentPost) {
      if (currentPost.hasUpvoted) {
        posts.downvote(currentPost);
      } else {
        posts.upvote(currentPost);
      }
    }

    $scope.addPost = function () {
      if ($scope.title == null) {
        return;
      }

      posts.create({
          title: $scope.title
        , link: $scope.link
        , hasUpvoted: false
      });

      $scope.title = '';
      $scope.link = '';
    };
  }
]);

// Angular service
app.factory('posts', ['$http', function($http) {
  // service body
  var o = {
    posts: []
  };
  
  /** get all posts */
  o.getAll = function() {
    return $http
      .get('/posts')
      .success(function(data) {
        // console.log(data);
        angular.copy(data, o.posts);
      });
  };

  /** create new posts */
  o.create = function(post) {
    return $http
      .post('/posts', post)
      .success(function(data) {
        o.posts.push(data);
      });
  };

  /** upvote a post */
  o.upvote = function(post) {
    return $http
      .put('/posts/' + post._id + '/upvote')
      .success(function(data) {
        post.upvotes += 1;
        post.hasUpvoted = true;
      });
  };

  /** downvote a post */
  o.downvote = function(post) {
    return $http
      .put('/posts/' + post._id + '/downvote')
      .success(function(data) {
        post.upvotes -= 1;
        post.hasUpvoted = false;
      });
  };

  /** get single post */
  o.get = function(id) {
    return $http
      .get('/posts/' + id)
      .then(function(res) {
        return res.data;
      });
  };

  /**  delete single post */
  o.delete = function(post) {
    return $http
      .delete('/posts/' + post._id)
      .success(function(data) {
        angular.copy(data, o.posts);
      });
  }

  /** add comment */
  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };

  /** upvote comment */
  o.upvoteComment = function(post, comment) {
    return $http
      .put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
      .success(function(data) {
        comment.upvotes += 1;
        comment.hasUpvoted = true;
      });
  };

  /** downvote comment */
  o.downvoteComment = function(post, comment) {
    return $http
      .put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
      .success(function(data) {
        comment.upvotes -= 1;
        comment.hasUpvoted = false;
      });
  };
  return o;
}]);

/** Post controller */
app.controller('PostsController', [
    '$scope'
  , 'posts'
  , 'post'
  , function($scope, posts, post) {

    $scope.post = post;

    /**
     * To toggle the upvote for a comment of the selected post
     * @param  {object} comment The comment to be upvoted
     */
    $scope.toggleUpvotes = function(currentComment) {
      if (currentComment.hasUpvoted) {
        posts.downvoteComment(post, currentComment);
      } else {
        posts.upvoteComment(post, currentComment);
      }
    };

    /**
     * To add a new comment for selected post
     */
    $scope.addComment = function () {
      if ($scope.body == null) {
        return;
      }
      console.log(posts);

      posts.addComment(post._id, {
          body: $scope.body
        , author: 'user'
        , upvotes: 0
        , hasUpvoted: false
      })
      .success(function (comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };
  }
]);

