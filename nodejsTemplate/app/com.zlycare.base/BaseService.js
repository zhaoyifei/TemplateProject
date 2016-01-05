/**
 * Created by zhaoyifei on 15/12/14.
 */

var
  User = require('../models/User'),
  Statistics = require('../models/statistics'),
  commonUtil = require('../../lib/common-util'),
  CONS = require('../configs/constants'),
  ErrorHandler = require('../../lib/ErrorHandler'),

  Q = require("q"),
  Promise = require('promise');

var BaseService = function () {
};
BaseService.prototype.constructor = BaseService;

module.exports = exports = new BaseService();
