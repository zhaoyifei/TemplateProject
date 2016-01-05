/**
 * Created by zhaoyifei on 15/11/19.
 */

var
  mongodb = require('../configs/db'),
  Schema = mongodb.mongoose.Schema;


var StatisticsSchema = new Schema({

  //db.getCollection('statistics').ensureIndex({"infoTime":-1, "infoName":1},{"unique":true})

  infoType: {type: String, default: 0},
  infoName: {type: String, default: 0},
  infoTime: {type: Number},
  info: {type: Number},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  isDeleted: {type: Boolean, default: false},

  description: {type: String},
  content: {}

},{
  collection: 'statistics'
});

var Statistics = mongodb.mongoose.model('Statistics', StatisticsSchema);

module.exports = Statistics;