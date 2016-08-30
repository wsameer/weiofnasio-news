var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** @type {Schema} define the comments schema */
var commentSchema = new Schema({
    body: String
  , author: String
  , hasUpvoted: { 
      type: Boolean
    , default: false
  }
  , upvotes: {
      type: Number
    , default: 0
  }
  , post: {
      type: mongoose.Schema.Types.ObjectId
    , ref: 'Post'
  }
}
, {
  timestamps: {
    createdAt: 'created_at'
  , updatedAt: 'updated_at'
  }
});

/** assign a upvote method to the "methods" object of our commentSchema */
commentSchema.methods.upvoteComment = function (callback) {
  console.log('upvoted');
  this.hasUpvoted = true;
  this.upvotes += 1;
  this.save(callback);
};

/** assign a downvote method to the "method" object of our commentSchema */
commentSchema.methods.downvoteComment = function (callback) {
  console.log('downvoted');
  this.hasUpvoted = false;
  this.upvotes -= 1;
  this.save(callback);
};

mongoose.model('Comment', commentSchema);