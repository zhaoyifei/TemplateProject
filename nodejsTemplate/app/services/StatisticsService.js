/**
 * Created by zhaoyifei on 15/11/19.
 */

var
  User = require('../models/User'),
  Statistics = require('../models/statistics'),
  commonUtil = require('../../lib/common-util'),
  CONS = require('../configs/constants'),
  ErrorHandler = require('../../lib/ErrorHandler'),

  Q = require("q"),
  Promise = require('promise');

var StatisticsService = function () {
};

function timeRange(now){
  //return function() {
  //  var day = now.getDay();
  //  var ONE_DATE = 1 * 24 * 60 * 60 * 1000;
  //  var last_zero = now.getTime() - (now.getTime() + 8*60*60*1000)%86400000;
  //  if (day < 4) {
  //    return [last_zero - ONE_DATE * day, last_zero - ONE_DATE * ( day - 4)];
  //  } else {
  //    return [last_zero - ONE_DATE * (day - 4), last_zero - ONE_DATE * ( day - 7)];
  //  }
  //};
  return function() {
    var day = now.getDay();

    var ONE_DATE = 1 * 24 * 60 * 60 * 1000;
    var last_zero = now.getTime() - (now.getTime() + 8*60*60*1000)%86400000;
    var add = (day + 1) % 7;
      return [last_zero - ONE_DATE * add, last_zero - ONE_DATE * (add - 7)];

  };
}

//function shuffleTime(t){
//    var ONE_DATE = 1 * 24 * 60 * 60 * 1000;
//    var last_zero = t.getTime() - (t.getTime() + 8*60*60*1000)%86400000;
//    var day = t.getDay();
//    if (day < 4) {
//      return last_zero - ONE_DATE * day;
//    } else {
//      return last_zero - ONE_DATE * (day - 4);
//    }
//}
//
//function timeList(startTime){
//  var ONE_DATE = 1 * 24 * 60 * 60 * 1000;
//  var start_item = parseInt(startTime);
//  var end_item = shuffleTime(new Date());
//  var k = 3;
//  if(new Date(startTime).getDay() < 4){
//    k = 4
//  }
//  var time_list = [];
//  while(start_item + k * ONE_DATE < end_item){
//    start_item += k * ONE_DATE;
//    console.log(start_item);
//    time_list.push(start_item);
//    if(k == 4){
//      k = 3;
//    }else{
//      k =4;
//    }
//  }
//  return time_list;
//}


function shuffleTime(t){
  var ONE_DATE = 1 * 24 * 60 * 60 * 1000;
  var last_zero = t.getTime() - (t.getTime() + 8*60*60*1000)%86400000;
  var day = t.getDay();
  var add = (day + 1) % 7;
  return last_zero - ONE_DATE * (add - 7);

}

var START_TIME = new Date(2015, 11, 12, 0, 0, 0);
var END_TIME = new Date(2016, 2, 11, 23, 59, 59);

function timeList(startTime){
  var ONE_DATE = 1 * 24 * 60 * 60 * 1000;
  var start_item = parseInt(startTime);
  if(start_item < START_TIME.getTime())
  start_item = START_TIME.getTime();
  var end_item = new Date();
  if(end_item > END_TIME){
    end_item = END_TIME;
  }
  var end_item = shuffleTime(end_item);
  var k = 7;

  var time_list = [];
  while(start_item + k * ONE_DATE < end_item){
    start_item += k * ONE_DATE;
    console.log(start_item);
    time_list.push(start_item);

  }
  return time_list;
}

function rankingHistory(date){
    var tr = timeRange(date);
    var num = 3;
    var condition =
      [
        {$match:{createdAt:{$gt: tr()[0], $lt: tr()[1]}, inviterPhoneNum:{$exists: true}, isDeleted: false, phoneNum:{$exists: true}}},
        {$group:{_id: "$inviterId", count: { $sum: 1 }, time: {$max: "$createdAt"}}},
        {$sort:{count:-1}},
        { $limit : parseInt(num) }
      ];

    var result;
    return User.aggregate(condition).exec().then(function(aggs){
      var ids = [];
      result = aggs;
      result.forEach(function(re){
        ids.push(re._id);
      });
      return User.find({_id:{$in:ids}}).select("name phoneNum createdAt").exec();
    }).then(function(users){
      result.forEach(function(re){
        users.forEach(function(u){
          if(re._id == u._id){
            re.phoneNum = u.phoneNum;
            re.name = u.name;
          }
        });
      });
      return result;
    });
}

StatisticsService.prototype.getRanking = function(tel, page){
  var tr = timeRange(new Date());
  var condition = {
    inviterPhoneNum: tel,
    createdAt:{$gt: tr()[0], $lt: tr()[1]},
    isDeleted: false,
    phoneNum: {$exists: true}
  };
  return Promise.all([User.findOne({phoneNum: tel}).select("name phoneNum").exec(),
    User.count(condition).exec(),
    User.find(condition).select("name phoneNum createdAt").sort({createdAt : -1}).skip(page * 10).limit(10).exec()
    ]);
};


StatisticsService.prototype.getRankingsta = function(num){
  var tr = timeRange(new Date());
  if(!num){
    num = 3;
  }
  var condition =
    [
      {$match:{createdAt:{$gt: tr()[0], $lt: tr()[1]}, inviterPhoneNum:{$exists: true}, isDeleted: false, phoneNum:{$exists: true}}},
      //{$sort:{createdAt:-1}},
      {$group:{_id: "$inviterId", count: { $sum: 1 }, time: {$max: "$createdAt"}}},
      {$sort:{count:-1, time:1}},
      { $limit : parseInt(num) }
    ];

var result;
  return User.aggregate(condition).exec().then(function(aggs){
    var ids = [];
    result = aggs;
    result.forEach(function(re){
      ids.push(re._id);
    });
    return User.find({_id:{$in:ids}}).select("name phoneNum createdAt").exec();
  }).then(function(users){
    result.forEach(function(re){
      users.forEach(function(u){
        if(re._id == u._id){
          re.phoneNum = u.phoneNum;
          re.name = u.name;
        }
      });
    });
    return result;
  });
};

StatisticsService.prototype.getRankingstahistory = function(num){
  if(!num){
    num = 10;
  }
  var condition = {
    infoType: "ranking",
    infoName: "langyabang"
  };
   return Statistics.find(condition).sort({infoTime : -1}).limit(num).exec();
};

StatisticsService.prototype.statistics = function(){
  //if(!startTime){
  //  startTime = Date.now();
  //}

  var funcsSti = [];
  var tl = timeList(START_TIME.getTime());
  console.log(tl);
  tl.forEach(function(t){
    funcsSti.push(rankingHistory(new Date(t)));
  });

  return Promise.all(funcsSti).then(function(results){
    console.log(results);
    var funcs = [];
    results.forEach(function(re,i){
      var it = tl[i];
      var ss = timeRange(new Date(tl[i]))();
      var rankingItem = {
        infoType: "ranking",
        infoName: "langyabang",
        infoTime: it,
        description: ss,
        content: re
      };

      funcs.push(Statistics.findOneAndUpdate({ infoType: "ranking",infoName: "langyabang", infoTime: it},rankingItem,{upsert: true, new: true}).exec())
    });


    return Promise.all(funcs);

  });
};

module.exports = exports = new StatisticsService();