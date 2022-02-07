const express = require('express');
const mongoose = require('mongoose')
const morgan  = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// bring routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')

const app  = express();
const PORT = process.env.PORT || 4000; 

//db 

mongoose
    .connect(process.env.MONGO_URI,{ 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then( () => console.log('DB connected'))
    .catch( err => console.log(err));


// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

//routes middleware
app.use('/api', authRoutes)
app.use('/api', postRoutes)
app.use('/api', commentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})