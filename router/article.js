const express = require('express')
const router = express.Router()

const ctrl = require('../controller/article.js')

router.get('/article/add',ctrl.showArticleAddPage)

// 发表文章
router.post('/article/add',ctrl.handleArticleAddPost)

//文章详情页
router.get('/article/info/:id',ctrl.showArticleInfoPage)

// router.post('/article/info/:id',ctrl.handleArticleInfoPost)
module.exports = router