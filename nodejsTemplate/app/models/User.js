/**
 *
 *  User
 *  用户基本信息, 包括 顾客、经纪人等
 *  Authors: Tom
 *  Created by Tom on on 5/20/15.
 *  Copyright (c) 2014 ZLYCare. All rights reserved.
 */
var
  mongodb = require('../configs/db'),
  Schema = mongodb.mongoose.Schema;
var modelTools = require('../tools/ModelTools');
var fields = {

  //介绍人信息
  inviterPhoneNum: String, // 邀请人电话号码
  inviterId: String,  // 邀请人UUID
  inviterNickname: String,  // 邀请人姓名
  source: {type: String, default: 'reg'},
  name: {type: String, default: ''},//姓名
  phoneNum: String,//注册手机号码,必需

  createdAt: {type: Number, default: Date.now},//用户注册时间
  updatedAt: {type: Number, default: Date.now},//用户最近的更新时间
  isDeleted: {type: Boolean, default: false}//该条记录是否被删除

};
//var selectFields = "";6
//(function(){
//  for(var fi in fields){
//    selectFields+= fi+" ";
//  }
//})();
var userSchema = new Schema( fields, {
  collection: 'users'
});
//
//var User = mongodb.mongoose.model('User', userSchema);
//User.fields = fields;
//User.selectFields = selectFields;
var User = modelTools.getModel('User',userSchema,[{key:'fields',value:fields},{key:'selectFields',value:modelTools.getSelectFields(fields)}]);
module.exports = User;
