const express = require('express')
//创建路由对象
const router = express.Router()

//导入用户路由处理函数模块
const user_handler = require('../router_handler/user')

//导入验证表单数据的中间件及验证规则
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')


//注册新用户
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

//登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)


module.exports = router