const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //Space를 없애주는 역할
        unique:1 //같은 이메일은 사용하지 못하게한다.
    },
    password: {
        type: String,
        minlengh:5
    },
    lastname: {
        type: String,
        minlengh:50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}