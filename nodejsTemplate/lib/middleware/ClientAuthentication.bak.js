/**
 *  ClientAuthentication
 *  中间件-客户端登陆认证
 *
 *  curl -X GET/POST/PUT/DELETE
 *    -H "X-Juliye-Application-Id: --------id---------"
 *    -H "X-Juliye-Application-Version: --------version---------"
 *    -H "X-Juliye-Terminal-Id: ------key-------"
 *    -H "X-Juliye-User-Id: ------phoneNum-------"
 *    -H "X-Juliye-Session-Token: ------token-------"
 *    https://api.zlycare.com/v/xxxxxx
 *
 *  Author: Jacky.L
 *  Created by Jacky.L on 10/16/14.
 *  Copyright (c) 2014 ZLYCare. All rights reserved.
 */
var
  util = require("util"),
  commonUtil = require("../common-util"),
  encrypt = commonUtil.commonMD5,
  isUpperCase = true,
  apiHandler = require('../../app/configs/ApiHandler'),
  configs = require('../../app/configs/server'),
  APP_ID = "x-juliye-application-id",
  APP_VERSION = "x-juliye-application-version",
  TERMINAL_ID = "x-juliye-terminal-id",
  USER_ID = "x-juliye-user-id",
  USER_MOBILE = "x-juliye-user-mobile",
  USER_NAME = 'x-juliye-user-name',
  SESSION_TOKEN = "x-juliye-session-token";//"x-juliye-session-token";

module.exports = function clientSession(options) {
  // 服务器配置参数
  options = options || {};
  var secret = options.secret || configs.secret || "";
  console.log("init middleware client authentication");

  return function clientSession(req, res, next) {

    //console.log("come in client session: " + util.inspect(req.headers));
    //req.headers['Access-Control-Allow-Origin'] = '*';
    //console.log("come in client session: " + util.inspect(req.headers));
    var reqIdentity = {};
    reqIdentity.applicationId = req.headers[APP_ID] || "";
    reqIdentity.applicationVersion = req.headers[APP_VERSION] || "";
    reqIdentity.terminalId = req.headers[TERMINAL_ID] || "";
    reqIdentity.userId = req.headers[USER_ID] || "";
    reqIdentity.sessionToken = req.headers[SESSION_TOKEN] || "";
    reqIdentity.phoneNum = req.headers[USER_MOBILE] || "";
    reqIdentity.userName = req.headers[USER_NAME] || "";

//    console.log("headers: " + util.inspect(req.headers));
    encryptToken = encrypt(reqIdentity.userId, secret, isUpperCase);
    //console.log("encryt token: " + encryptToken + "  :  " + reqIdentity.sessionToken);
    //验证登陆身份合法性 "/3/authCode"
    var url = req.url;
    if (url.indexOf('?') > 0)
      url = url.substr(0, url.indexOf('?'));
    var urls = url.split('/');
    //console.log(urls)

    if (urls[1] !== "4" && urls[1] !== "mgmt") {
      //不兼容V4版前的所有api
      return apiHandler.COMMON_NOT_AUTHORIZED(res);
    } else if (req.method == "POST" && urls[urls.length - 1] == "sessions") {
      //TODO-Something
    } else if (req.method == "POST" && urls[2] === "authCodes") {
      //TODO-Something
    } else if (req.method == "PUT" && urls[2] === "authCodes") {
      //TODO-Something
      //}else if(req.method == "GET" && urls[2] === "info"){
    } else if (urls[2] === "info") {
      //TODO-Something
      if(req.method == "HEAD")
        return res.status(200).end("OK");
    } else if (req.method == "GET" && urls[2] === "search") {
      //TODO-Something
    } else if (req.method == "GET" && urls[2] === "tags") {
      //TODO-Something
    } else if (req.method == "POST" && urls[2] === "transactions") {
      //TODO-Something
    } else if (req.method == "POST" && urls[2] === "users") {
      //TODO-Something
    } else if (req.method == "GET" && urls[2] === "users") {
      //TODO-Something
    } else if (req.method == "PUT" && urls[3] === "resetPassword") {
      //TODO-Something
    } else if (req.method == "GET" && urls[4] === "newItems") {
      //为兼容1.0版本中IOS的Bug,后期需要增加接口的验证
    } else if (urls[1] === "mgmt") {
      //TODO-Something
    } else {
      if (encryptToken === reqIdentity.sessionToken) {
        req.identity = reqIdentity;
      } else {
        //Session 验证失败
        return apiHandler.COMMON_NOT_AUTHORIZED(res);
      }
    }

    // 监听res回调header方法
    res.on('header', function () {
      // 更新client session
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Client-Session');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      //更新session token
      var newUserId = res.userId || reqIdentity.userId;
      var newToken = res.sessionToken || reqIdentity.sessionToken;
      res.setHeader(SESSION_TOKEN, newToken);
    });

    next();
  };
};