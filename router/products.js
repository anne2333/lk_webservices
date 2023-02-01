const express = require('express')
//创建路由对象
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
const fs = require('fs')
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { delete_product_schema } = require('../schema/product')


// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads/products') })

//导入用户路由处理函数模块
const products_handler = require('../router_handler/products')
router.post('/my/upload/products', upload.single('file'), function (req, res, next) {
  const newname = req.file.path + req.file.mimetype.replace('image/', '.')
  fs.rename(req.file.path, newname, () => { })
  next()
}, products_handler.addProduct)

//前端获取产品列表
router.get('/api/product/list', products_handler.getProductList)
//后台获取产品列表
router.get('/my/product/list', products_handler.getList)
router.get('/my/product/delete/:id', expressJoi(delete_product_schema), products_handler.deleteProduct)

module.exports = router