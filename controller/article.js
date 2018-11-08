const moment = require("moment");
const marked = require('marked')
const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "my_blog"
});

module.exports = {
  showArticleAddPage(req, res) {
    // console.log(req.session)
    if (!req.session.isLogin) return res.redirect("/");

    res.render("./article/add.ejs", {
      user: req.session.user,
      isLogin: req.session.isLogin
    });
  },

  handleArticleAddPost(req, res) {
    if (!req.session.isLogin)
      return res
        .status(400)
        .send({ status: 400, msg: "您的登录信息已失效, 请保存文章后重新登录" });
    const body = req.body;
    body.ctime = moment().format("YYYY-MM-DD HH:mm:ss");
    body.author_id = req.session.user.id;

    const insertSql = "insert into articles set ?";
    conn.query(insertSql, body, (err, result) => {
      if (err)
        return res.status(500).send({ status: 500, msg: "文章发表失败,请重试!" });
        res.send({ status: 200, msg: "ok", articleId: result.insertId });
    });
  },

  //文章详情页
  showArticleInfoPage(req,res){
    const id = req.params.id
    const querySql = 'select * from articles where id = ?'
    conn.query(querySql,id,(err,result) => {
        if(err || result.length !== 1) return res.send({ status: 500, msg: "文章获取失败,请重试!" })

        result[0].content = marked(result[0].content)
        res.render('./article/info.ejs', {
          user: req.session.user,
          isLogin: req.session.isLogin,
          article:result[0]
      })
    })
    
  },

    //编辑文章页
  showArticleEditPage(req,res){
    if (!req.session.isLogin) return res.redirect('/')
    const id = req.params.id
    const querySql = 'select * from articles where id = ?'
    conn.query(querySql,id,(err,result) => {
      // console.log(err)
      // console.log(result)
      if(err || result.length !== 1) return res.send({ status: 500, msg: "文章获取失败,请重试!" })
      res.render('./article/edit.ejs',{
        user: req.session.user,
        isLogin: req.session.isLogin,
        article:result[0]
      })
    })
    
  },

  //编辑文章保存
  handleArticleEditPost(req,res){
    const article = req.body
    article.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(article)
    const updateSql = 'update articles set ? where id = ?'
    conn.query(updateSql,[article,article.id],(err,result) => {
      if (err || result.affectedRows !== 1) return res.status(400).send({ status: 400, msg: '修改文章失败, 请重试!', data: null })

      res.send({status: 200, articleId: article.id})
    })
  }
};
