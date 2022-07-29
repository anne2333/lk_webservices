//导入数据库模块
const db = require('../db/index')
//导入加密模块
const bcrypt = require('bcryptjs')

//获取用户基本信息
exports.getUserInfo = (req, res) => {
  // console.log(req);
  const sql = `select id, username, nickname, user_pic from ev_users where id=?`
  db.query(sql, req.auth.id, (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    //未查询到用户
    if (result.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      status: 0,
      message: '获取用户信息成功',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      data: result[0]
    })
  })
}


//更新用户信息函数
exports.updateUserInfo = (req, res) => {
  const sql = `update ev_users set ? where id=?`
  db.query(sql, [req.body, req.body.id], (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    //更新失败
    if (result.affectedRows !== 1) return res.cc('更新用户信息失败')
    res.cc('更新用户信息成功', 0)
  })
}

//重置用户密码函数
exports.updatePwd = (req, res) => {
  const sql = `select * from ev_users where id =?`
  db.query(sql, req.auth.id, (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    //获取用户信息失败
    if (result.length !== 1) return res.cc('获取用户信息失败')
    // 判断提交的旧密码是否正确
    //compareSync前面是未加密密码 和面是加密密码
    const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
    if (!compareResult) return res.cc('原密码错误！')
    // 定义更新用户密码的 SQL 语句
    const sql = `update ev_users set password=? where id=?`

    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sql, [newPwd, req.auth.id], (err, results) => {
      // SQL 语句执行失败
      if (err) return res.cc(err)

      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')

      // 更新密码成功
      res.cc('更新密码成功！', 0)
    })
  })
}

//更新用户头像
exports.updateAvatar = (req, res) => {
  const sql = `update ev_users set user_pic = ? where id=?`
  db.query(sql, [req.body.avatar, req.auth.id], (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    //更新失败
    if (result.affectedRows !== 1) return res.cc('更新用户头像失败')
    res.cc('更新用户头像成功', 0)
  })
}