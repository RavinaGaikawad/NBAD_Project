var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userconnectionSchema = new Schema({
  Connection: {
    type : Schema.ObjectId,
    ref : 'Connection'
  },
  rsvp: String
});

// var userconnection = function(Connection, rsvp){
//   var userconnectionModel ={
//     Connection: Connection,
//     rsvp: rsvp
//   };
//   return userconnectionModel;
// };
//
// module.exports.userconnection = userconnection;

module.exports = mongoose.model('userconnection', userconnectionSchema);
