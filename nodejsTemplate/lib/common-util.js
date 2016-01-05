/**
 *  common-util
 *  封装通用方法
 *  Created by Jacky.L on 4/16/14.
 *  Copyright (c) 2014 ZLYCare. All rights reserved.
 */
/**
 * 通用应答的Json实体结构
 * @param statusCode
 * @param msgStr
 * @param data
 * @returns {{status: *, msg: *, res: *}}
 */
var util = require('util'),
  mongoose = require('mongoose'),
  //pinyin = require('pinyin'),
  sms = require('../app/configs/sms'),
  http = require('http'),
  request = require('request'),
//querystring=require('querystring'),
  crypto = require('crypto'),
  server = require('../app/configs/server'),
  Push = require('./push'),
  Fiber = require('fibers'),
  _ = require('underscore'),
  qiniuConfigs = require('../app/configs/qiniu'),
  qiniu = require('qiniu'),
  handler = require('../app/configs/ApiHandler');

var uuid_24bit_style = /\w{24}/;


//获取num位随机数
exports.getRandomCode = function (num) {
  //随机数
  var source = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
    "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z"
  ];
  num = num || 5;
  var code = "";
  for (var i = 0; i < num; i++) {
    code += source[Math.round(Math.random() * 61)];
  }
  return code;
};

/**
 * 获取七牛存储token
 * @returns {*|Object}
 */
exports.getToken = function () {
  qiniu.conf.ACCESS_KEY = qiniuConfigs.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = qiniuConfigs.SECRET_KEY;
  //console.info('get token');
  var putPolicy = new qiniu.rs.PutPolicy(qiniuConfigs.BUCKET,
    null, null, null, null, null, null, 60 * 60 * 24 * 365);//设置一年有效期
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putpolicy.persistentOps = persistentops;
  //putPolicy.persistentNotifyUrl = persistentNotifyUrl;
  //putPolicy.expires = expires;
  //console.info("Generate uptoken: " + putPolicy);
  return putPolicy.token();
};
/**
 * 判断timstamps数组中的时间是否都在时间区间内
 * @param begin
 * @param end
 * @param timestamps    时间数组
 * @param timeInterval  循环间距
 * @returns {boolean}
 */
exports.isBetweenTimeZone = function (begin, end, timestamps, timeInterval) {

  for (var i=0; i<timestamps.length; i++) {
    var time = timestamps[i];
    if (timeInterval) {
      var sub = (time - begin) % timeInterval;
      var floor = (Math.floor(time - begin)) / timeInterval;
      if (sub < 0 || (time - (floor * timeInterval)) > end)
        return false;
    } else if(time < begin || time > end) {
      return false;
    }
  }
  return true;
};

/**
 * 验证时间合法性
 * @param timestamps
 * @param base
 * @param slot
 * @returns {boolean}
 */
exports.isValidatedTime = function (timestamps, base, slot) {
  //
  for (var i=0; i<timestamps.length; i++) {
    if ((timestamps[i] - base) % slot !== 0)
      return false;
  }
  return true;
};

/**
 * Call with Current Continuation.
 * Used for transform the function calls from callback style to sequential style.
 *
 * Author: Evan Liu
 */
exports.callcc = function (continuation) {
  var fiber = Fiber.current;
  continuation(function (result) {
    fiber.run(result);
  });
  return Fiber.yield();
};

/**
 * Copy fields selectively from one object to another.
 * WARNING: Only works for tier-1 fields.
 *
 * Author: Evan Liu
 */
exports.partialCopy = function (object, fields) {
  var ret = {};
  for (var i in fields) {
    ret[fields[i]] = object[fields[i]];
  }

  return ret;
};

/**
 * MD5加密
 * @param data
 * @returns {*}
 */
exports.commonMD5 = function (data, salt, upper) {
  if (data && salt) data += salt;
  // console.log("data:" + data);
  if (upper)
    return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
  else
    return crypto.createHash('md5').update(data).digest('hex');
};

exports.commonResult = function (statusCode, msgStr, data) {
  var result = {status: statusCode, msg: msgStr, res: data};
  return result;
};

/**
 * 通用应答的Response实体结构
 * @param res
 * @param status
 * @param data
 * @param type
 */
exports.commonResponse = function (res, status, data, type) {

  var contentType = 'application/json';
  if (type) contentType = type;
  if (data === undefined) data = {};
  res.status(status)
    .set('Set-Cookie', {'zly_session_id': '10001'})
    .set('Content-Type', contentType)
    .set('Access-Control-Allow-Origin', '*')
    .json(data);
};
/**
 * 获取当前要查询的分页条件
 * @param req
 * @param defaultFrom
 * @param defaultPageSize
 * @returns {{$slice: *[]}}
 */
exports.getCurrentPageSlice = function (req, defaultFrom, defaultPageSize, defaultSort) {
  var from = defaultFrom;
  var pageSize = defaultPageSize;
  var size = parseInt(req.query.pageSize);
  var num = parseInt(req.query.pageNum);
  var sorts = {'createdAt': 1};//按日期从小到大排列//{'createDate': -1}//按日期从大到小排序
  //pageSlice.sort = sort;
  //console.info(size + " : " + num + "  :" + typeof(size));
  if ((typeof(size) === 'number') && size > 0)
    pageSize = size;
  if ((typeof(num) === 'number') && num > 0)
    from = num * pageSize;
  var slices = {skip: from, limit: pageSize};
  if (defaultSort) {
    sorts = defaultSort;
    slices.sort = sorts;
  } else {
    slices.sort = sorts;
  }

  console.info(util.inspect(slices));
  return slices;
};
/**
 * 判断请求中是否有body内容
 * @param req
 * @returns {boolean}
 */
exports.hasBody = function (req) {
  return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};
/**
 * 判断请求body类型是否为form表单
 * @param req
 * @returns {boolean}
 */
exports.isFormReq = function (req) {
  console.log(util.inspect(req.headers));
  var type = req.headers["content-type"];
  console.log(util.inspect(type));
  return (type.indexOf('multipart/form-data') > -1)
    || (type.indexOf('application/x-www-form-urlencoded') > -1);
};
/**
 * 判断请求body类型是否为Json实体
 * @param req
 * @returns {boolean}
 */
exports.isJsonReq = function (req) {
  var type = req.headers.content_type;
  return type.indexOf('application/json ') > -1;
};
/**
 * 请求中是否明确指定返回类型为html
 * @param req
 */
exports.acceptHtml = function (req) {
  var accept = req.headers.accept;
  console.info(accept + "   typeof accept: " + typeof(accept));
  if (typeof(accept) != 'undefined')
    return accept.indexOf('text/html') > -1;
  else
    return false;
};
/**
 * 获取MongoDB中的ObjectId对象
 * @returns {*}
 */
exports.getNewObjectId = function () {
  var id = mongoose.Types.ObjectId();
  console.info("new Object ID : " + id);
  return id;
};
/**
 *
 * @param hanz
 * @returns {Array}
 */
//exports.getPinyinNormal = function (hanz) {
//  var res = [];
//  if (typeof(hanz) == 'string') {
//    var tmp = pinyin(hanz, {
//      style: pinyin.STYLE_NORMAL
//    });
//    for (var x = 0; x < tmp.length; x++) {
//      res[x] = tmp[x][0];
//    }
//  }
//  return res;
//};
/**
 * 获取
 * @param doc
 * @param newdoc
 * @param params
 */
exports.getFormatDocObj = function (doc, newdoc, params) {

  var len = 0;

  if (params)
    len = params.length;

  console.log("params length is: " + len);

  for (var i = 0; i < len; i++) {
    var param = params[i];
    //console.log("param: " + param);
    if (newdoc[param] || newdoc[param] == "" || newdoc[param] == 0) {//如果有该元素 或者 该元素为空或零
      doc[param] = newdoc[param];
    }
  }
  return doc;
};

/**
 *
 * @param uuid
 * @returns {*}
 */
exports.isUUID24bit = function(uuid){
  return uuid_24bit_style.test(uuid);
};

/**
 *
 * @param tplId
 * @param number
 * @param text
 * @private
 */
exports.sendSms = function (tplId, number, text) {
  console.log("Current env is:" + server.env + "; Begin Sending message:" + tplId
    + "  :  " + number + "  :  " + text);

  if (!number || number == "") {
    return;
  }

  // 测试环境短信屏蔽列表
  var idList = ["586493"];
  if (process.env.NODE_ENV != "production" && idList.indexOf(tplId) > 0) { //非生产环境且在屏蔽列表中
    return;
  }

  //测试环境短信验证码
  if (process.env.NODE_ENV != "production" && tplId == "408913") {
    tplId = "410070";
  }

  request.post(sms.SMS_SERVER + sms.SMS_SEND_API,
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('send message failed:', err);
      }
      console.log('send message successful!  Server responded with:' + body);
    }).form({
      "apikey": sms.API_KEY,
      "mobile": number,
      "tpl_id": tplId,//"642401",
      "tpl_value": text//"#code#=xxxx"
    });
};

exports.sendOnlySms = function ( number, text) {
  console.log("Current env is:" + server.env + "; Begin Sending message:"
    + "  :  " + number + "  :  " + text);

  if (!number || number == "") {
    return;
  }

  request.post(sms.SMS_SERVER + sms.SMS_SEND_ONLY_API,
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('send message failed:', err);
      }
      console.log('send message successful!  Server responded with:' + body);
    }).form({
      "apikey": sms.API_KEY,
      "mobile": number,
      "text": text

    });
};
/**
 *
 * @param params
 * @returns {boolean}
 */
exports.isAllExist = function (params) {
  for (var i = 0; i < params.length; i++) {
    if (!(params[i] || params[i] == 0 || params == ""))
      return false;
  }
  return true;
};
/**
 *
 * @param param
 * @param can
 * @returns {boolean}
 */
exports.isExist = function (param, can) {
  if (!(param || param == 0 || params == ""))
    return false;
  return true;
};
/**
 *
 * @returns {string}
 */
exports.generateAuthCode = function () {
  return (Math.random() + "").substr(2, 6);
};
/**
 * 推送信息
 * @param client
 */
function pushMsg(client, userId, msgType, msgTitle, msgDescription) {
  console.log("pushing msg!!");
  var opt = {
    push_type: 1,//推送类型,1单播,2组播,3所有
    user_id: userId
    //channel_id: "5222687915086388201",
    //device_type: 4
    //ios特有字段，可选
    //aps: {
    //  alert: "朱李叶消息提醒",
    //  Sound: "",
    //  Badge: 0
    //}
    //message_type: msgType,//消息类型,默认0为消息,1为通知
    //messages: JSON.stringify([msg]),
    //msg_keys: JSON.stringify(["zly_push_key"])
  };
  switch (msgType) {
    case 0:
      console.log("Msg type 0");
      opt["message_type"] = 0;
      opt["messages"] = JSON.stringify([msgTitle]);
      opt["msg_keys"] = JSON.stringify(["zly_push_key"]);
      break;
    case 1:
      console.log("Msg type 1");
      opt["message_type"] = 1;
      opt["messages"] = JSON.stringify([
        {
          title: msgTitle,
          description: msgDescription
        }
      ]);
      opt["msg_keys"] = JSON.stringify(["zly_push_key"]);
      break;
    default:
      console.log("Msg type default");
      break;
  }
  client.pushMsg(opt, function (err, result) {
    console.log("Push callback!!");
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
  })
}
/**
 * push
 * 参考文档
 * http://developer.baidu.com/wiki/index.php?title=docs/cplat/push/sdk/phpserver
 */
exports.push = function (userPushId, msgType, msgTitle, msgDescription, refreshMsg, callback) {

  var back = function (status, result) {
    if (callback) {
      return callback(status, result);
    } else {
      return;
    }
  };

  if (!userPushId || userPushId == "")
    back(true, null);

  var opt = {//3235210
    ak: 'UhKLwOGvIZuWktxoRKniPvwn',
    sk: 'cfiDmO9W4WhZpmQ6FBCBR8xxT8Ckn1Gm'
  };
  var client = new Push(opt);
  //pushMsg(client, userPushId, type, msgTitle, msgDescription);

  console.log("pushing msg!!");
  var opt = {
    aps: {
      alert: "朱李叶消息提醒",
      Sound: 'default',
      Badge: 0
    },
    push_type: 1,//推送类型,1单播,2组播,3所有
    user_id: userPushId//百度pushId
  };
  switch (msgType) {
    case 0:
      console.log("Msg type 0");
      opt["message_type"] = 0;
      opt["messages"] = JSON.stringify([msgTitle]);
      opt["msg_keys"] = JSON.stringify(["zly_push_key"]);
      break;
    case 1:
      console.log("Msg type 1");
      opt["message_type"] = 1;
      opt["messages"] = JSON.stringify([
        {
          title: msgTitle,
          description: msgDescription
        }
      ]);
      opt["msg_keys"] = JSON.stringify(["zly_push_key"]);
      break;
    case 2:
      console.log("Msg type 2");
      opt["message_type"] = 0;
      opt["aps"].alert = JSON.stringify([refreshMsg]);
      opt["messages"] = JSON.stringify([refreshMsg]);
      opt["msg_keys"] = JSON.stringify(["zly_push_key"]);
      break;
    default:
      console.log("Msg type default");
      break;
  }
  client.pushMsg(opt, function (err, result) {
    console.log("Push callback!!");
    if (err) {
      console.log(err);
      return back(false, err);
    } else {
      return back(true, result);
    }
  })

};
/**
 *
 * @param data
 * @param validation
 * @param onSuccess
 * @param onFailure
 * @returns {*}
 */
exports.validate = function (data, validation, onSuccess, onFailure) {

  if (!data)
    return onFailure(handler.COMMON_MISSING_FIELDS, data);

  console.log("req payload: " + util.inspect(data));
  var required = validation.required || [];
  var optional = validation.optional || [];
  var mandatory = validation.mandatory || [];

  if (required) {
    var fields = Object.keys(data);
    var diff = _.difference(required, fields);
    /* Be careful of the order of the parameters of _.difference.
     * We will only go fail if there are missing fields.
     * If there are more, we will go succeed.
     */
    if (diff.length > 0)
      return onFailure(handler.COMMON_MISSING_FIELDS, diff);
  }

  for (field in mandatory) {
    if (mandatory[field] != data[field])
      return onFailure(handler.COMMON_WRONG_FIELDS, field);
  }

  //Get the union fields
  var fields = _.union(required, optional);

  // 清洗数组null
  for (f in fields) {
    if (data[fields[f]] instanceof Array) {
      data[fields[f]] = _.without(data[fields[f]], null);
    }
  }

  //Pick the fields from data
  return onSuccess(handler.CREATED, _.pick(data, fields));
};

/**
 * MM月dd日hh时mm分
 * @param time
 * @returns {string}
 */
exports.genCommonDate = function (time) {
  var d = new Date(time);
  var dstring = "";
  dstring += d.getMonth() + 1;
  dstring += "月";
  dstring += d.getDate();
  dstring += "日";
  dstring += d.getHours() + "时" + d.getMinutes() + "分";

  return dstring;
};

/**
 * yyyy-MM-dd
 * @param time
 * @returns {string}
 */
exports.getDate = function (time) {
  var d = new Date(time);
  return d.format("yyyy-MM-dd");
};

/**
 * yyyy-MM-dd
 * @param time
 * @returns {string}
 */
exports.getyyyyMMdd = function (time) {
  var d = new Date(time);
  return d.format("yyyyMMdd");
};

exports.dateFormat = function (time, format) {
  var d = new Date(time);
  return d.format(format);
};

/**
 * 日期格式化方法
 * @param format
 * @returns {*}
 */
Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};