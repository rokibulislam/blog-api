const { UserModel, validateUser } = require('../models/user')
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    const { error } = validateUser(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);
    
    const { username, email, password } =  req.body;
    const userExists = await UserModel.findOne({ email: email });

    if(userExists)
        return res.status(400).send('user already registered');

    try { 
        let user = new UserModel({
            username: username,
            email: email,
            password: password
        })

        user.password = await user.encryptPassword(user.password);

        const token = user.generateAuthToken();

        await user.save();

        res.send({
            'token': token,
            user: { 
                _id: user._id, 
                username: user.username,
                name: user.name,
                email: user.email
            }
        })
    } catch(err) {
        return res.status(400).send(err);
    }
}

const signin = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await UserModel.findOne({ email: req.body.email });
    if( !user )
        return res.status(401).send('User with that email does not exist. Please signup.')

    const validPassword = user.validatePassword(req.body.password);

    if (!validPassword) return res.status(400).send('Invalid email or password');
    
    const token = user.generateAuthToken();

    let { _id, username, name, email } = user;

    return res.json({
        token,
        user: { _id, username, name, email }
    });
}

const signout = async ( req, res ) => {
    res.send({
        'text': 'Signout Route'
    })
}

module.exports = { signup, signin, signout }