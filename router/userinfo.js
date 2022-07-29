const express = require('express')
//创建路由对象
const router = express.Router()
const userinfo_handler = require('../router_handler/userinfo')

//导入验证表单数据的中间件及验证规则
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

//获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

//更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

//重置用户密码
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePwd)

//更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router