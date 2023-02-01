//导入数据库模块
const db = require('../db/index')
const path = require('path')
const fs = require('fs')

exports.addProduct = (req, res) => {
  // 手动判断是否上传了产品图片
  if (!req.file || req.file.fieldname !== 'file') return res.cc('未上传产品图片')
  const productInfo = {
    // 标题、赛道、系列
    ...req.body,
    // 产品图片在服务器端的存放路径
    image: path.join('/uploads/products', req.file.filename + req.file.mimetype.replace('image/', '.')),
    // 产品上传时间
    pub_date: new Date(),
  }
  const sql = `insert into ev_products set ?`
  // 导入数据库操作模块
  // 执行 SQL 语句
  db.query(sql, productInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('新增产品失败')

    // 新增产品成功
    res.cc('新增产品成功', 0)
  })
}

exports.getProductList = (req, res) => {
  var q = req.query
  if (q.sd == '' || q.xl == '') res.cc("错误")
  var sql = `select count(*) count from ev_products where isdelete=0 `
  sql += " and sd = '" + q.sd + "'"
  sql += " and xl='" + q.xl + "'"
  db.query(sql, function (err, result) {
    //执行sql失败
    if (err) return res.cc(err)
    var total = result[0]['count']
    var _sql = `select  *  from ev_products  where isdelete=0 `
    _sql += " and sd = '" + q.sd + "'"
    _sql += " and xl='" + q.xl + "'"
    _sql += ` order by pub_date desc limit ? , ? `
    var start = (q.pagenum - 1) * q.pagesize
    var size = parseInt(q.pagesize)
    db.query(_sql, [start, size], function (err, result) {
      //执行sql失败
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取产品列表成功',
        pagenum: q.pagenum,
        // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
        data: result,
        total
      })
    })
  })
}
exports.getList = (req, res) => {
  var q = req.query
  var sql = `select count(*) count from ev_products where isdelete=0 `
  if (q.sd != '') sql += " and sd = '" + q.sd + "'"
  if (q.xl != '') sql += " and xl='" + q.xl + "'"
  db.query(sql, function (err, result) {
    //执行sql失败
    if (err) return res.cc(err)
    var total = result[0]['count']
    var _sql = `select  *  from ev_products  where isdelete=0 `
    if (q.sd != '') _sql += " and sd = '" + q.sd + "'"
    if (q.xl != '') _sql += " and xl='" + q.xl + "'"
    _sql += ` order by pub_date desc limit ? , ? `
    var start = (q.pagenum - 1) * q.pagesize
    var size = parseInt(q.pagesize)
    db.query(_sql, [start, size], function (err, result) {
      //执行sql失败
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取产品列表成功',
        pagenum: q.pagenum,
        // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
        data: result,
        total
      })
    })
  })
}

//根据ID删除产品
exports.deleteProduct = (req, res) => {
  const sql = `update ev_products set isdelete=1 where id=?`
  db.query(sql, req.params.id, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // SQL 语句执行成功，但是影响行数不等于 1
    if (result.affectedRows !== 1) return res.cc('删除产品失败！')

    // 删除文章分类成功
    res.cc('删除产品成功！', 0)
  })
}

