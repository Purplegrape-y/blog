const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

// 设置默认采用的模引擎名称
app.set('view engine','ejs')
// 设置模板页面的存放路径
app.set('views','./views')

// 托管静态资源
app.use('/node_modules',express.static('./node_modules'))

// 注册body-parser中间件  注册以后才可以在req中使用body对象获取客户端post提交过来的数据
app.use(bodyParser.urlencoded({ extended: false }))

// 使用循环的方式,进行路由的自动注册
fs.readdir(path.join(__dirname,'./router'),(err,filenames) => {
    if(err) return console.log('读取router目录中的路由失败')
    filenames.forEach(item => {
        const router = require(path.join(__dirname,'./router',item))
        app.use(router)
    })
})

app.listen(3000,(req,res) => {
    console.log('server running at http://127.0.0.1:3000')
})