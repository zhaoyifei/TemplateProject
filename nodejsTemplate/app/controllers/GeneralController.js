/**
 * Created by zhaoyifei on 15/12/14.
 */


var
  commonUtil = require('../../lib/common-util'),
  apiHandler = require('../configs/ApiHandler'),
  constants = require('../configs/constants'),
  configs = require('../configs/api');


var GeneralController = function (app) {};

GeneralController.prototype.constructor = GeneralController;

StatisticsController.prototype.loadPaths = function(){

};

var generateGET = function(func){
  var generalGET = function(req,res){
    func(req.query).then(function(result){
      apiHandler.OK(res,result);
    },function(err){
      return apiHandler.handleErr(res,err);
    });
  };
  return generalGET;
};
var generatePOST = function(func){
  var generalPOST = function(req,res){
    func(req.query, req.payload).then(function(result){
      apiHandler.OK(res,result);
    },function(err){
      return apiHandler.handleErr(res,err);
    });
  };
  return generalPOST;
};
var generatePUT = function(func){
  var generalPUT = function(req,res){
    func(req.query, req.payload).then(function(result){
      apiHandler.OK(res,result);
    },function(err){
      return apiHandler.handleErr(res,err);
    });
  };
  return generalPUT;
};
var generateDELETE = function(func){
  var generalDELETE = function(req,res){
    func(req.query).then(function(result){
      apiHandler.OK(res,result);
    },function(err){
      return apiHandler.handleErr(res,err);
    });
  };
  return generalDELETE;
};










module.exports = exports = new StatisticsController();