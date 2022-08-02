// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
const article_handler = require('../router_handler/articles')

const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema, delete_article_schema, update_article_schema } = require('../schema/article')

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads/articles/cover') })
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中，如文件名、文件大小
// 将文本类型的数据，解析并挂载到 req.body 属性中，如title
// 发布新文章
router.post('/my/article/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

//获取文章列表
router.get('/my/article/list', article_handler.getArticleList)

//获取前3条新闻
router.get('/api/article/topthree', article_handler.getTopThreeArticles)
//删除文章
router.get('/my/article/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArticle)


//根据id获取文章
router.get('/my/article/:id', expressJoi(delete_article_schema), article_handler.getArticleById)

//更新文章
router.post('/my/article/update', upload.single('cover_img'), expressJoi(update_article_schema), article_handler.updateArticleById)

// 向外共享路由对象
module.exports = router