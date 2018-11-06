const express = require('express')
const router = express.Router()

const ctrl = require('../controller/user.js')
// 渲染页面接口
router.get('/register', ctrl.showRigsterPage);
router.get('/login',ctrl.showLoginPage)
// 注册接口
router.post('/register',ctrl.handleRegisterPost)

//登录接口
router.post('/login',ctrl.handleLoginPost)

module.exports = router