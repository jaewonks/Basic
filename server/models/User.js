const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){ //비밀번호가 변경되는 경우
    //비밀번호를 암호화 시킨다
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)
        bcrypt.hash(user.password,salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
            })
        })
    } else { //비밀번호가 아닌 다른 것을 바꿀 경우
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, callback) {
    //plainPassword =/ 암호화된 비번
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return callback(err)
        callback(null, isMatch) 
    })
}

userSchema.methods.generateToken = function(callback){
    //jsonwebtoken을 이용해서 token을 생성하기
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save( (err, user) => {
        if(err) return callback(err)
        callback(null, user) //에러는 없고 유저 정보만 전달
    })
}

userSchema.statics.findByToken = function(token, callback){ //토큰을 가져옴
    var user = this;
    //가져온 토큰을 복호화(decode)
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token":token }, function(err, user){
            if(err) return callback(err);
            callback(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }