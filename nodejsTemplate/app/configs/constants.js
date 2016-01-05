/**
 *  constant configs
 *  常量信息
 *  Created by LuoMiao on 7/21/14.
 *  Copyright (c) 2014 ZLYCare. All rights reserved.
 */
module.exports = {
  zlyId: '53ce353fe5e9c3e1173a3624',          //zly账户id
  zlyFundId: "53df24da619b8703432d20a6",        //zly公益积金id
  zlyCouponId: "1002",
  zlyFundName: "朱李叶公益积金",
  zlyPhoneNum: "961",
  zlyChannelNum: "zlyChannel",
  zly400: "4006182273",
  brokerTel: "010-53553621",
  zly400Phone: "18500978823",//"18500978802",
  brokerToolsDownloadURL: "http://app-consultant.zlycare.com/",
  internalDownloadURL: "http://app-internal.zlycare.com/",
  publicDownloadURL: "http://app.zlycare.com/",

  weixinToken: "43df24da619b8703432d2aw2",        //微信token
  weixinServer: "wx.zlycare.com/weixin",

  weixinappid: "wxe2374aa483c7f35a",
  weixinsecret:  "6c381a084156ce768bbcb96b5620e00b",
  weixinNum: "Juliye_Care",


  ORDER_AUTH_INC_ID: '54be1f11031c5c861c90b37a',
  BEIJING_ID: '5509080d8faee0fbe0c4a6c9',
  CHAOYANG_ID: '5509080d8faee0fbe0c4a6eb',

  AUTH_EXPIRE_TIME: 1 * 60 * 60 * 1000,//验证码过期时间 一小时

  TIME_10_DAY: 240 * 60 * 60 * 1000,
  TIME_0: 0,
  TIME_10_YEAR: 10 * 365 * 24 * 60 * 60 * 1000,

  TIME2014BASE: 1388620800000,//
  TIME15M: 15 * 60 * 1000,// 15分钟间隔
  TIME1M: 60 * 1000,// 1分钟间隔
  TIME1H: 60 * 60 * 1000,//时间1小时  —— 首诊
  TIME6H: 6 * 60 * 60 * 1000,//时间6小时

  TIME12H: 12 * 60 * 60 * 1000,//时间6小时

  TIME3D: 3 * 24 * 60 * 60 * 1000,//3天 —— 评价过期
  TIME2D: 2 * 24 * 60 * 60 * 1000,//2天
  TIME1Y: 360 * 24 * 60 * 60 * 1000,//1年 —— 拟无限

  TIME7D: 7 * 24 * 60 * 60 * 1000,//提现默认拒绝时间

  TIMEPREEXECTASK1:  24 * 60 * 60 * 1000,

  PendingTime: 12 * 60 * 60 * 1000,// 12小时
  CloseTime: 48 * 60 * 60 * 1000,  // 48小时

  ORDER_NUMBER_DIS: 3,//标识开始几单分账

  REWARD_FIRST_COMPLETE_ORDER_PAYMENT: 50,

  //TimeTask 定时任务
  TimeTask10M: '0 */10 * * * *',
  TimeTask20M: '0 */20 * * * *',
  TimeTask30M: '0 */30 * * * *',
  TimeTask10H: '0 0 */10 * * *',
  TimeTask23H: '0 0 */23 * * *',

  // 20140915 修改分配系数
  // 首诊分配机制
  zlyFVPoint: 0.12,//
  ccFVPoint: 0.04,
  bFVPoint: 0.8,
  ssFVPoint: 0.04,

  // 转诊分配机制
  zlyRPoint: 0.10,
  ccRPoint: 0.00,
  bRPoint: 0.16,
  sRPoint: 0.7,
  ssRPoint: 0.04
};