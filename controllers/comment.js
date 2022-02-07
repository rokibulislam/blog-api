const { CommentModel, validateComment } = require('../models/comment')
const { PostModel } = require('../models/post')
const { UserModel } = require('../models/user')

const commentCreate = async (req, res) => {
    let { content } = req.body
    let post = await PostModel.findOne({ _id: req.params.id });
    let user = await UserModel.findOne({ _id: req.user.id })
    
    if(!post)
        return res.status(401).send('post with given id not found!')

    const { error } = validateComment(req.body);

    if (error) 
        return res.status(400).send(error.details[0].message);
        
    let data = {
        content: content,
        post: req.params.id,
        author: req.user.id,
    }    
    
    let comment = CommentModel(data);

    await comment.save();

    res.send(comment);
}


const replyCreate = async (req, res) => {    
    let comment = await CommentModel.findOne({ _id: req.params.cid, post: req.params.id });
    if(!comment)
        return res.status(401).send('comment with given id not found!')

    const { error } = validateComment(req.body);
    
    if (error) 
        return res.status(400).send(error.details[0].message);
    
    let { content } = req.body

    let data = {
        content: content,
        post: req.params.id,
        author: req.user.id,
        parent: req.params.cid
    }    

    let reply = CommentModel(data);

    await reply.save();

    res.send(reply);
}


const commentList = async ( req, res ) => {
    let id   = req.params.id;
    let comments = await CommentModel.find({ post: id }).sort( [['_id', -1]] ).populate('author').lean().exec();
    comments = translateDataToTree(comments);

    return res.send(comments)
}

function translateDataToTree(data) {
    let parents = data.filter(value => value.parent == 'undefined' || value.parent == null)
    let childrens = data.filter(value => value.parent !== 'undefined' && value.parent != null)
    
    let translator = (parents, childrens) => {
        parents.forEach((parent) => {
            childrens.forEach((current, index) => {
                if (current.parent.toString() === parent._id.toString()) {
                    let temp = JSON.parse(JSON.stringify(childrens))
                    temp.splice(index, 1)
                    translator([current], temp)
                    typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
                }
            }
        )
      }
      )
    }
  
    translator(parents, childrens)
  
    return parents
}

module.exports = { commentCreate, commentList, replyCreate }