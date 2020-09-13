const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증처리
    //클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;
    //토큰을 복호화한후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token; //req에 넣어주는 이유:
        req.user = user;   //유저정보를 가지고 사용할 수 있다.
        next();
    })
    //유저가 있으면 인증O
    //유저가 없으면 인증X
}

module.exports = { auth };