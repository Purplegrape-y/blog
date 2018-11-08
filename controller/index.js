const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_blog'
})

module.exports = {
    showIndexPage(req,res) {
        const querySql = `select a.id, a.title, a.ctime, u.nickname, u.username from articles as a
        left join users as u
        on a.author_id = u.id
        order by a.id desc`

        conn.query(querySql,(err,result) => {
            if(!result) result = []
            // console.log(result)
            res.render('./index.ejs',{
                user:req.session.user,
                isLogin:req.session.isLogin,
                articles:result
            })
        })
        
    }
}
