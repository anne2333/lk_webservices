const joi = require('joi')
const id = joi.number().integer().min(1).required()
//删除产品规则
module.exports.delete_product_schema = {
  params: {
    id
  }
}