const express = require('express')
const router = express.Router();

const { isAdmin, isAuth } = require('../middlewares/authmiddlewar');

const { postCreate, postUpdate, postDelete, postList, postRead } = require('../controllers/post')

router.get("/post", postList );

router.post("/post", isAuth, postCreate );

router.get('/post/:id', postRead );

router.put('/post/:id', isAuth, postUpdate );

router.delete('/post/:id', isAuth,  postDelete);

module.exports = router;