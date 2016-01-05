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
  constants = require('../../app/configs/constants'),
  JULIYE_HEADER = {
    APP_ID : "x-juliye-application-id",
    APP_VERSION : "x-juliye-application-version",
    PHONE_VERSION : "x-juliye-application-phone-version",
    TERMINAL_ID : "x-juliye-terminal-id",
    USER_ID : "x-juliye-user-id",
    DEVICE_MARK : "x-juliye-application-device-mark",//设备唯一标识
    DEVICE_MODEL : "x-juliye-application-device-model",//设备型号
    CHANNEL_INFO : "x-juliye-application-channel",//渠道
    SESSION_TOKEN : "x-juliye-session-token"
    //USER_MOBILE = "x-juliye-user-mobile",
    //USER_NAME = 'x-juliye-user-name',
    //PROVINCE_ID = 'x-juliye-province-id',
    //AREA_ID = 'x-juliye-area-id',
    };

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
    reqIdentity.applicationId = req.headers[JULIYE_HEADER.APP_ID] || "";
    reqIdentity.applicationVersion = req.headers[JULIYE_HEADER.APP_VERSION] || "";
    reqIdentity.terminalId = req.headers[JULIYE_HEADER.TERMINAL_ID] || "";
    reqIdentity.userId = req.headers[JULIYE_HEADER.USER_ID] || "";
    reqIdentity.sessionToken = req.headers[JULIYE_HEADER.SESSION_TOKEN] || "";
    reqIdentity.phoneVer = req.headers[JULIYE_HEADER.PHONE_VERSION] || "";
    //reqIdentity.phoneNum = req.headers[USER_MOBILE] || "";
    //reqIdentity.userName = req.headers[USER_NAME] || "";

    //reqIdentity.provinceId = req.headers[PROVINCE_ID] || "";
    //reqIdentity.areaId = req.headers[AREA_ID] || "";

    //console.log("headers: " + util.inspect(req.headers));
    encryptToken = encrypt(reqIdentity.userId, secret, isUpperCase);
    //console.log("encryt token: " + encryptToken + "  :  " + reqIdentity.sessionToken);
    //验证登陆身份合法性 "/3/authCode"
    //if (encryptToken === reqIdentity.sessionToken) {
    req.identity = reqIdentity;
    //}

    var url = req.url;
    if (url.indexOf('?') > 0)
      url = url.substr(0, url.indexOf('?'));
    //var urls = url.split('/');
    console.log(url + "  :  " + reqIdentity.userId);
    //TODO: API验证身份接口配置

    // 监听res回调header方法
    res.on('header', function () {
      // 更新client session
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Client-Session');
      res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      //更新session token
      //var newUserId = res.userId || reqIdentity.userId;
      var newToken = res.sessionToken || reqIdentity.sessionToken;
      res.setHeader(JULIYE_HEADER.SESSION_TOKEN, newToken);
    });

    next();
  };
};