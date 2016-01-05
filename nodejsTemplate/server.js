
//Module dependencies.
var
  express = require('express'),
  connect = require('connect'),
  path = require('path'),
  router = require('./app/router'),
  configs = require('./app/configs/server'),
  clientAuth = require('./lib/middleware/ClientAuthentication'),
  Handlers =  require('./lib/middleware/ExpressMidware'),
  logConfig = require('./app/configs/logger'),
  timeout = require('connect-timeout'),
  qiniu = require('qiniu'),
  qiniuConfig = require('./app/configs/qiniu'),
  util = require('util');

var app = express();

// all environments
app
  .use(timeout('30s'))
  .use(Handlers.haltOnTimedout)
  .use(connect.static(path.join(__dirname, 'public')))
  .use(connect.favicon(path.join(__dirname, 'public/zlycare.ico')))
  .use(connect.static(path.join("/js", 'public/js')))
  //.use(connect.bodyParser())
  //.use(connect.logger('dev'))
  //.use(connect.multipart())
  //.use(connect.bodyParser())
  .use(connect.bodyParser({uploadDir:'./uploads'}))
  .use(connect.json())
  .use(connect.urlencoded())
  .use(connect.cookieParser())
  //.use(function (req, res, next) {
  //  console.log(req.body);
  //  //console.log(util.inspect(req));
  //  next();
  //})
  .use(logConfig.log4js.connectLogger(logConfig.getLogger('HTTP'),logConfig.configs))
  //客户端身份认证
//
  .use(Handlers.clientAuthHandler)
;

qiniu.conf.ACCESS_KEY = qiniuConfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = qiniuConfig.SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(qiniuConfig.BUCKET);

app.get('/uptoken', function(req, res, next) {
  var token = uptoken.token();
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      uptoken: token
    });
  }
});

router(app);
app.use(Handlers.unCatchErrorHandler);
exports.server = app;
