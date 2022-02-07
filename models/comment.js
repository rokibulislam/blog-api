const mongoose = require('mongoose')
const{ ObjectId } = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const commentSchema =  new mongoose.Schema(
    {
        content: { type: String, required: true },
        post: { type: ObjectId, ref: 'Post', required: true },
        author: { type: ObjectId, ref: 'User', required: true },
        comments: { type: ObjectId, ref: 'Comment' },
        parent: { type: ObjectId, default: null },
    },
    {
        timestamps: true
    }
);

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', { virtuals: true, });

const validateComment = (comment) => {
    
    const commentSchema = Joi.object({
      content: Joi.string().required(),
      post: Joi.objectId(),
      author: Joi.objectId(),
      parent: Joi.objectId()
    });
    
    return commentSchema.validate(comment);
}

const CommentModel = mongoose.model('Comment',commentSchema)

module.exports = { CommentModel, validateComment }

