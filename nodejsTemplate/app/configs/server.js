/**
 *  server
 *  服务器基本配置
 *  Created by Jacky.L on 4/16/14.
 *  Copyright (c) 2014 ZLYCare. All rights reserved.
 */
var
  db = "zlyweb",
  dbUrl_ut = 'mongodb://localhost/zlyweb_test',
  dbUrl_production = 'mongodb://ZLY-MONGODB-2/' + db,
  dbUrl_test = 'mongodb://ZLY-TEST/' + db,
  dbUrl_local = 'mongodb://localhost/' + db,
  NODE_ENV = process.env.NODE_ENV;

module.exports = {

  dbPort: 27017,
  //生产DB配置
 // dbUrl_production: 'mongodb://ZLY-DB-2/' + this.db,
  //本机开发配置
  dbUrl_test: 'mongodb://localhost/zlyweb',

  dbUrl: NODE_ENV == 'production' ? dbUrl_production : NODE_ENV == '_test' ? dbUrl_test : dbUrl_local,
  port: 9012,
  secret: 'wecare',

  env: NODE_ENV == 'production' ? 1 : 0,// 0 测试环境, 1 生产环境
};
