const express = require('express')
//创建路由对象
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')


// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads/articles/content') })

//导入用户路由处理函数模块
const image_handler = require('../router_handler/image')
router.post('/', upload.single('image'), image_handler.upload)

router.post('/delete', image_handler.delete)

module.exports = router