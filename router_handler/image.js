//导入数据库模块
const db = require('../db/index')
const path = require('path')


exports.upload = (req, res) => {
  if (!req.file || req.file.fieldname !== 'image') return res.cc('上传图片失败')
  const sql = `insert into ev_images set ?`
  const imageInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    url: path.join('/uploads/articles/content', req.file.filename),
    // 文章作者的Id
    auth_id: req.auth.id,
    // 文章发布时间
    pub_date: new Date(),
  }
  db.query(sql, imageInfo, (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    //上传失败
    if (result.affectedRows !== 1) return res.cc('上传图片失败')
    console.log(imageInfo.url);
    res.cc('http://127.0.0.1:8080/uploads/articles/content/' + req.file.filename, 0)
  })
}