const mysql = require('mysql')

//创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '710780',
  database: 'zy_web_db'
})

module.exports = db