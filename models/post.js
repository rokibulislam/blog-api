const mongoose = require('mongoose')
const{ ObjectId } = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const postSchema =  new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            min: 3,
            max: 255
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postSchema.set('toJSON', { virtuals: true, });

const validatePost = (post) => {
    const postSchema = Joi.object({
      title: Joi.string().min(3).max(255).required(),
      author: Joi.objectId(),
      content: Joi.string().required()
    });
    
    return postSchema.validate(post);
}

const PostModel = mongoose.model('Post',postSchema)

module.exports = { PostModel, validatePost }