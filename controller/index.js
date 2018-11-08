const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_blog',
    multipleStatements: true
})

module.exports = {
    showIndexPage(req,res) {
        const pageSize = 2
        // console.log(req.query)
        const currentPage = parseInt(req.query.page) || 1
        
        const querySql = `select a.id, a.title, a.ctime, u.nickname, u.username from articles as a
        left join users as u
        on a.author_id = u.id
        order by a.id desc
        limit ${(currentPage - 1)*pageSize},${pageSize};
        select count(*) as count from articles`

        conn.query(querySql,(err,result) => {
            console.log(err)
            console.log(result)
            if(!result) result = []
            // console.log(result)
            let totalCount = result[1][0].count
            let totalPage =Math.ceil( totalCount/pageSize)
            res.render('./index.ejs',{
                user:req.session.user,
                isLogin:req.session.isLogin,
                articles:result[0],
                totalPage :totalPage,
                currentPage:currentPage
            })
        })
        
    }
}
