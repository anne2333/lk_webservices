// 导入 express 模块
const express = require('express')
const joi = require('joi')
const config = require('./config')

//解析token的中间件
const { expressjwt: jwt } = require('express-jwt')

// 创建 express 的服务器实例
const app = express()
//封装返回信息的函数
app.use((req, res, next) => {
  //status默认为1，标识失败
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

//导入并配置cors中间件，解决跨域问题
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

//注册解析token的中间件
app.use(jwt({
  secret: config.jwtSecretKey,
  algorithms: ["HS256"],
}).unless({ path: [/^\/(api|uploads)\//] }))


//托管静态文件
app.use('/uploads', express.static('./uploads'))


//导入路由模块
//用户注册登录
const userRouter = require('./router/user')
app.use('/api', userRouter)

//获取用户基本信息
const userInfoRouter = require('./router/userinfo')
app.use('/my', userInfoRouter)

const articleRouter = require('./router/articles')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/', articleRouter)

//文章图片上传
const uploadImage = require('./router/image')
app.use('/my/upload/image', uploadImage)

//产品图片上传
const uploadProducts = require('./router/products')
app.use('/', uploadProducts)

//错误级别中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  //认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份信息认证失败')
  res.cc(err)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8080, function () {
  console.log('api server running at http://127.0.0.1:8080')
})