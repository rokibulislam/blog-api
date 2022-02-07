const { PostModel, validatePost } = require('../models/post');

const postCreate = async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) 
        return res.status(400).send(error.details[0].message);
    
    let { title, content, author } = req.body;

    try { 
        let data = {
            title: title, 
            content: content,
            author: req.user.id
        }

        let post = PostModel(data);

        await post.save();
        
        res.send(post);
    
    } catch(err) {
        return res.status(400).send(err);
    }
}

const postUpdate = async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) 
        return res.status(400).send(error.details[0].message);

    let id = req.params.id;
    let { title, content, author } = req.body
        
    let post = await PostModel.findOneAndUpdate( { _id: id }, {
        title: title,
        content: content,
        author: author 
    }, { new: true } )

    if (!post) 
        return res.status(401).send('The post with given id was not found!');

    res.send(post)
}

const postDelete = async (req, res) => {
    let id   = req.params.id;
    let post = await PostModel.findOneAndDelete( { _id: id } )
    if(!post) 
        return res.status(401).send('post with given id not found!')
    res.json(post)
}

const postList = async ( req, res ) => {
    let posts = await PostModel.find();
    
    return res.send(posts)
}

const postRead = async ( req, res ) => {
    let id = req.params.id;
    let post = await PostModel.findOne({ _id: id }).populate('author');
    
    if(!post) 
        return res.status(401).send('post with given id not found!')

    return res.send(post);
}

module.exports = { postCreate, postUpdate, postDelete, postList, postRead }