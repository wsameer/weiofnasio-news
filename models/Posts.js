var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** @type {Schema} define the Posts schema */
var postSchema = new Schema({
    title:      { type: String, required: true }
  , link:       { type: String }
  , hasUpvoted: { type: Boolean, default: false }
  , upvotes:    { type: Number, default: 0 }
  , comments:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}
, {
  timestamps: {
      createdAt: 'created_at'
    , updatedAt: 'updated_at'
  }
});

/** assign a upvote method to the "methods" object of our postSchema */
postSchema.methods.upvote = function (callback) {
  console.log('upvoted');
  this.hasUpvoted = true;
  this.upvotes += 1;
  this.save(callback);
};

/** assign a downvote method to the "methods" object of our postSchema */
postSchema.methods.downvote = function (callback) {
  console.log('downvoted');
  this.hasUpvoted = false;
  this.upvotes -= 1;
  this.save(callback);
};

mongoose.model('Post', postSchema);