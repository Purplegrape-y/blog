const express = require('express')
const router = express.Router()

const ctrl = require('../controller/article.js')

router.get('/article/add',ctrl.showArticleAddPage)

// 发表文章
router.post('/article/add',ctrl.handleArticleAddPost)

router.get('/article/info/:id',ctrl.showArticleInfoPage)
module.exports = router