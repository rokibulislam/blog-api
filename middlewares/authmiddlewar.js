const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
    const token = req.headers['access-token'];
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    const decoded = jwt.verify(token, process.env.jWT_PRIVATE_KEY || 'blog_jwtPrivateKey');
    req.user = decoded;

    return next();
}

const isAuth = (req, res, next ) => {
    const token = req.headers['access-token'];
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    let privatekey = process.env.jWT_PRIVATE_KEY || 'blog_jwtPrivateKey';

    const decoded = jwt.verify(token, privatekey);
    req.user = decoded;

    return next();
}

module.exports = { isAdmin, isAuth }