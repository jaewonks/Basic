const express = require('express') //express모듈을 가져온다
const app = express() //function을 이용해 새로운 express앱을 만든다
const port = 5000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Jaewonks:Kk052614..@basicdb.htg21.mongodb.net/<dbname>?retryWrites=true&w=majority',
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
//포트에 실행하게한다
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})