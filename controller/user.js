const moment = require('moment')

const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_blog'
})

module.exports = {
//    渲染注册页面接口
    showRigsterPage (req,res){
        res.render('./user/register.ejs', {})
    },
    //渲染登录页面
    showLoginPage(req,res){
        res.render('./user/login.ejs', {})
    },

    //注册接口
    handleRegisterPost(req,res){
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
    },

    //登录接口
    handleLoginPost (req,res){
        const user = req.body
        const querySql = 'select * from users where username = ? and password = ?'
        conn.query(querySql,[user.username,user.password],(err,result) => {
            if(err) return res.status(500).send({status: 500, msg: '登录失败!请重试!'})
            if(result.length === 0) return res.status(400).send({status: 400, msg: '用户名或密码错误!请重试!'})

            // console.log(req.session)
            // 登录成功后存储用户信息到session中
            req.session.user = result[0]
            // 存储登录状态
            req.session.isLogin = true

            // 设置cookie存储时间
            let hour = 1000 * 60 * 60 * 24 * 30
            req.session.cookie.expires = new Date(Date.now() + hour)

            res.send({status: 200, msg: '恭喜您!登录成功!'})


        })
    },

    //注销
    handleLogoutGet (req,res){
        // 销毁session
        req.session.destroy(err => {
            res.redirect('/')
        })
    }
}