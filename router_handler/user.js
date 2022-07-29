//导入数据库模块
const db = require('../db/index')
//导入加密模块
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
const config = require('../config')

//注册处理函数
exports.regUser = (req, res) => {
  const userInfo = req.body

  //查询用户名是否被占用
  const sqlStr = `select * from ev_users where username = ?`
  db.query(sqlStr, userInfo.username, (err, result) => {
    //执行语句失败
    if (err)
      return res.cc(err)
    //判断是否有用户
    if (result.length > 0)
      return res.cc('用户名被占用')
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)

    //插入新用户
    const insertSql = 'insert into ev_users set ?'
    db.query(insertSql, {
      username: userInfo.username,
      password: userInfo.password
    }, (err, result) => {
      //执行语句失败
      if (err)
        return res.cc(err)
      if (result.affectedRows != 1)
        return res.cc('注册用户失败')
      //注册成功
      return res.cc('注册用户成功', 0)
    })
  })
}


//登录处理函数
exports.login = (req, res) => {
  const userInfo = req.body
  const sql = `select * from ev_users where username =?`
  db.query(sql, userInfo.username, (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    //未查询到用户
    if (result.length !== 1) return res.cc('登录失败')

    //比较密码是否正确
    const compareResult = bcrypt.compareSync(userInfo.password, result[0].password)
    if (!compareResult) return res.cc('登录失败')

    //用户名密码都正确
    //生成JWT Token,将数据库获取的用户信息去掉密码和头像
    const user = { ...result[0], password: '', user_pic: '' }
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '10h', // token 有效期为 10 个小时
    })
    res.send({
      status: 0,
      message: '登录成功',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr
    })
  })
}