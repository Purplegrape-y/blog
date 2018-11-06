const moment = require("moment");

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
    res.render('./articles/info.ejs', {
        user: req.session.user,
        isLogin: req.session.isLogin
    })
  }
};