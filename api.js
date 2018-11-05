const express = require('express')

const app = express()

// 设置默认采用的模引擎名称
app.set('view engine','ejs')
// 设置模板页面的存放路径
app.set('views','./views')

app.get('/',(req,res) => {
    res.render('./index.ejs',{name:'zs',gender:'男'})
})

app.listen(3000,(req,res) => {
    console.log('server running at http://127.0.0.1:3000')
})