const express = require('express')
const router = express.Router();

const { isAdmin, isAuth } = require('../middlewares/authmiddlewar');

const { commentCreate,commentList, replyCreate} = require('../controllers/comment')

router.get("/post/:id/comment/", commentList );

router.post("/post/:id/comment", isAuth, commentCreate );

router.post("/post/:id/comment/:cid/reply", isAuth, replyCreate );

module.exports = router;