const express = require('express')
const router = express.Router()

const ctrl = require('../controller/index.js')
// 测试项目是否搭建成功
router.get('/',ctrl.showIndexPage)

module.exports = router