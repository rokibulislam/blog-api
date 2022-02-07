const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const userSchema =  new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            min: 3,
            max: 100
        },
        email: {
            type: String,
            trim: true,
            required: true,
            max: 255,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
);

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', { virtuals: true, });

userSchema.methods =  {
    generateAuthToken: function(){
        let privatekey = process.env.jWT_PRIVATE_KEY || 'blog_jwtPrivateKey';
        const token = jwt.sign({ id: this.id, name: this.name, email: this.email }, privatekey, { expiresIn: '1d' })

        return token;
    },
    
    encryptPassword: async function (pasword) {
        const salt = await bcrypt.genSalt(10);

        return bcrypt.hash(pasword, salt);
    },

    validatePassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    }
};

function validateUser(user) {
    const schema = {
      email: Joi.string().email().min(5).max(255).required(),
      password: Joi.string().min(5).max(1024).required(),
    };
  
    if (user.hasOwnProperty('username'))
      schema.username = Joi.string().min(3).max(100).required();
  
    if (user.hasOwnProperty('isAdmin')) schema.isAdmin = Joi.boolean();
  
    const userSchema = Joi.object(schema);
  
    return userSchema.validate(user);
  }

const UserModel = mongoose.model('User', userSchema)

module.exports =  { UserModel, validateUser }