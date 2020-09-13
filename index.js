const express = require('express') //express모듈을 가져온다
const app = express() //function을 이용해 새로운 express앱을 만든다
const port = 5000
const bodyParser = require('body-parser');
const {User} = require("./models/User");
const config = require("./config/key")

//클라이언트에서 오는 정보를 서버에서 분석
app.use(bodyParser.urlencoded({extended:true})); //application/X-www-form-urlencoded
app.use(bodyParser.json()); //application/json

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log('MongoDB connected!'))
      .catch(err => console.log(err))

//화면에 뿌린다
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
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

//포트에 실행하게한다
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})