const joi = require('joi')
// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_name = joi.string().valid('行业动态', '新闻资讯', '法律法规').required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// 定义 分类Id 的校验规则
const id = joi.number().integer().min(1).required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_name,
        content,
        state,
    },
}

// 验证规则对象 - 获取文章列表


//删除文章规则
module.exports.delete_article_schema = {
    params: {
        id
    }
}

//更新文章规则
module.exports.update_article_schema = {
    body: {
        id,
        title,
        cate_name,
        content,
        state,
    },
}