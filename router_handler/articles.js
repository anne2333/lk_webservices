// 导入数据库操作模块
const db = require('../db/index')
const path = require('path')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('未上传文章封面')
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads/article', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.auth.id,
    }
    const sql = `insert into ev_articles set ?`
    // 导入数据库操作模块

    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布文章失败')

        // 发布文章成功
        res.cc('发布文章成功', 0)
    })
}

//获取文章列表
exports.getArticleList = (req, res) => {
    var q = req.query
    var sql = `select count(*) count from ev_articles where is_delete=0 `
    if (q.cate_name != '') sql += ' and cate_name = ' + q.cate_name
    if (q.state != '') sql += " and state='" + q.state + "'"
    db.query(sql, function (err, result) {
        //执行sql失败
        if (err) return res.cc(err)
        var total = result[0]['count']
        var _sql = `select  *  from ev_articles  where is_delete=0 `
        if (q.cate_name != '') _sql += ' and cate_name = ' + q.cate_name
        if (q.state != '') _sql += " and state='" + q.state + "'"
        _sql += ` order by pub_date desc limit ? , ? `
        var start = (q.pagenum - 1) * q.pagesize
        var size = parseInt(q.pagesize)
        db.query(_sql, [start, size], function (err, result) {
            //执行sql失败
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '获取文章列表成功',
                // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
                data: result,
                total
            })
        })
    })

}

//根据ID删除文章
exports.deleteArticle = (req, res) => {
    const sql = `update ev_articles set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, result) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (result.affectedRows !== 1) return res.cc('删除文章失败！')

        // 删除文章分类成功
        res.cc('删除文章成功！', 0)
    })
}