/**
 * Authors: Tom
 * Date: 2015.11.20
 * Copyright (c) 2015 Juliye Care. All rights reserved.
 */

var
  commonUtil = require('../../lib/common-util'),
  apiHandler = require('../configs/ApiHandler'),
  constants = require('../configs/constants'),
  StatisticsService = require('../services/StatisticsService'),
  configs = require('../configs/api');

var StatisticsController = function () {};

StatisticsController.prototype.constructor = StatisticsController;


StatisticsController.prototype.getRanking = function(req,res){

  var tel = req.query.tel;
  var page = req.query.page ? req.query.page : 0;
  StatisticsService.getRanking(tel, page).then(function(result){
    apiHandler.OK(res,result);
  },function(err){
    return apiHandler.handleErr(res,err);
  });
};

StatisticsController.prototype.getRankingsta = function(req,res){
  var num = req.query.num;
  StatisticsService.getRankingsta(num).then(function(result){
    apiHandler.OK(res,result);
  },function(err){
    return apiHandler.handleErr(res,err);
  });
};


StatisticsController.prototype.getRankingstahistory = function(req,res){
  var num = req.query.num;
  StatisticsService.getRankingstahistory(num).then(function(result){
    apiHandler.OK(res,result);
  },function(err){
    return apiHandler.handleErr(res,err);
  });
};

StatisticsController.prototype.statistics = function(req,res){
  var startTime = req.query.startTime;
  StatisticsService.statistics(startTime).then(function(result){
    apiHandler.OK(res,result);
  },function(err){
    return apiHandler.handleErr(res,err);
  });
};

module.exports = exports = new StatisticsController();