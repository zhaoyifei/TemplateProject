/**
 * model tools
 * Created by menzhongxin on 15/7/28.
 */
var db = require('../configs/db');
var ModelTools = function(){};

/**
 * 根据schema构造对应的model
 * @param modelName:modelName
 * @param schema:对应的schema
 * @param fieldMap:需要赋值给该model的属性，该字段为{key:'key',value:'value'}格式的数组
 * @returns {*|Model}
 */
ModelTools.getModel = function(modelName,schema,fieldMap){
    var model = db.mongoose.model(modelName,schema);
    for(var fi in fieldMap){
        model[fi.key] = fi.value;
    }
    return model;
}
/**
 * 返回selectFields
 * @param fields
 * @returns {string}
 */
ModelTools.getSelectFields = function(fields){
    var selectfields = '';
    for(var fi in fields){
        selectfields += fi + ' ';
    }
    return selectfields;
}
module.exports = ModelTools;