/**
 * Authors: Tom
 * Date: 2015.11.20
 * Copyright (c) 2015 Juliye Care. All rights reserved.
 */
var
  StatisticsController = require('./controllers/StatisticsController');


module.exports = function (app) {

//取得用户的介绍用户列表和排名,如果十名之外不计算排名
  app.get("/ranking", StatisticsController.getRanking);

  app.get("/rankingsta", StatisticsController.getRankingsta);

  app.get("/rankingsta/history", StatisticsController.getRankingstahistory);

  app.get("/statistics", StatisticsController.statistics);
};
