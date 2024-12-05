const mongoose  = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type:String}, 
    email: {type:String}, 
    password: {type:String}, 
    role: {type:String},
    categories: {type:Array},
    queries: {type:Array},
    score: {type:String},
    followings: {type:Array},
    answered: {type:Array},
})

const Users = mongoose.model('Users', userSchema, 'users')

const mySchemas = {'Users':Users}

module.exports = mySchemas