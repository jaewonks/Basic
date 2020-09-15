const express = require('express') //express모듈을 가져온다
const app = express() //function을 이용해 새로운 express앱을 만든다
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const config = require("./config/key")
const { auth } = require("./middleware/auth");

//클라이언트에서 오는 정보를 서버에서 분석
app.use(bodyParser.urlencoded({extended:true})); //application/X-www-form-urlencoded
app.use(bodyParser.json()); //application/json

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log('MongoDB connected!'))
      .catch(err => console.log(err))

//화면에 뿌린다
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req, res) => res.send('Hello Hello'))

app.post('/api/users/register', (req, res) => {
  //회원가입할때 필요한 정보들을 client에서 가져오면 
  //그 정보를 데이터베이스에 넣어준다.
  const user = new User(req.body)//body-parser로 클라이언트에서 오는 정보를 받는다
  
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err}) //에러가 나면 에러를 출력
    return res.status(200).json({
        success:true
    })
  })
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
            if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 DB에 있으면 비밀번호 일치 여부 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            //비밀번호가 맞다면 토큰 생성
            user.generateToken((err,user) => { //user에 토큰이 들어있다.
                if(err) return res.status(400).send(err);

                //토큰을 저장 -> 쿠키/로컬스토리지..(여러군데 저장 가능)
                res.cookie("x_auth", user.token) 
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해왔다는 것은 Authentication이 True라는 말
    res.status(200).json({
        _id: req.user._id,
        //관리자여부 role 1 어드민, 2 특정부서어드민, 0 일반유저
        isAdmin: req.user.role === 0 ? false : true, 
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
      { token: "" }
      , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
      })
  })

//포트에 실행하게한다
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))