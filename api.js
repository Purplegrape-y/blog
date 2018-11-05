const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const moment = require('moment')

const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_blog'
})

// 设置默认采用的模引擎名称
app.set('view engine','ejs')
// 设置模板页面的存放路径
app.set('views','./views')

// 托管静态资源
app.use('/node_modules',express.static('./node_modules'))

// 注册body-parser中间件  注册以后才可以在req中使用body对象获取客户端post提交过来的数据
app.use(bodyParser.urlencoded({ extended: false }))


// 测试项目是否搭建成功
app.get('/',(req,res) => {
    res.render('./index.ejs',{name:'zs',gender:'男'})
})
// 渲染页面接口
app.get('/register', (req, res) => {
    res.render('./user/register.ejs', {})
});
app.get('/login',(req,res) => {
    res.render('./user/login.ejs', {})
})
// 注册接口
app.post('/register',(req,res) => {
    const user = req.body
    // 判断表单信息是否合法,不合法返回错误状态码和信息
    console.log(user)
    if(user.username.trim().length === 0 ||user.password.trim().length === 0 || user.nickname.trim().length === 0) return res.status(400).send({status:400,msg:'请填写完整的表单信息'})

    const querySql = 'select count(*) as count from users where username=?'
    conn.query(querySql,user.username,(err,result) => {
        console.log(result)
        if(err) return res.status(500).send({status:500,msg:'用户查询失败'})
        if(result[0].count != 0) return res.status(402).send({ status: 402, msg: '用户名已存在!请重试!' })

         // 给用户添加创建时间的属性
        user.ctime = moment().format('YYYY-MM-DD HH:mm:ss')

        // 用户名不存在需要执行添加用户语句
        const addSql = 'insert into users set ?'
        conn.query(addSql,user,(err,result) => {
            // console.log(result)
            if(err || result.affectedRows != 1) return res.status(500).send({ status: 500, msg: '用户添加失败!请重试!' })

            res.send({ status: 200, msg: '用户注册成功!' });
        })
        
    })
})






app.listen(3000,(req,res) => {
    console.log('server running at http://127.0.0.1:3000')
})