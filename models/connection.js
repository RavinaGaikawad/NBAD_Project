var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectionSchema = new Schema({
  connectionID : {type: String, required: true},
  connectionName: String,
  connectionTopic: String,
  hostedby: String,
  location: String,
  details: String,
  date: String,
  time: String
});

// var connection = function(connectionID, connectionName, connectionTopic, hostedby, location, details, date, time, rsvp) {
//   var connectionModel = {
//     connectionID: connectionID,
//     connectionName: connectionName,
//     connectionTopic: connectionTopic,
//     hostedby: hostedby,
//     location: location,
//     details: details,
//     date: date,
//     time: time
//   };
//   return connectionModel;
// };

// class Connection {
//   constructor(connectionID, connectionName, connectionTopic, hostedby, location, details, date, time, rsvp) {
//     this.connectionID = connectionID,
//       this.connectionName = connectionName,
//       this.connectionTopic = connectionTopic,
//       this.hostedby = hostedby,
//       this.location = location,
//       this.details = details,
//       this.date = date,
//       this.time = time
//   }
//
//   get connectionID() {
//     return this.connectionID;
//   }
//
//   get connectionName() {
//     return this.connectionName;
//   }
//
//   get connectionTopic() {
//     return this.connectionTopic;
//   }
//
//   get details() {
//     return this.details;
//   }
//
//   get time() {
//     return this.time;
//   }
//
//   get date() {
//     return this.date;
//   }
//
//   get location() {
//     return this.location;
//   }
//
//   get hostedby() {
//     return this.hostedby;
//   }
//
//   get rsvp() {
//     return this.rsvp;
//   }
//
//   set connectionID(connectionID) {
//     this.connectionID = connectionID;
//   }
//
//   set connectionName(connectionName) {
//     this.connectionName = connectionName;
//   }
//
//   set connectionTopic(connectionTopic) {
//     this.connectionTopic = connectionTopic;
//   }
//
//   set details(details) {
//     this.details = details;
//   }
//
//   set hostedby(hostedby) {
//     this.hostedby = hostedby;
//   }
//
//   set location(location) {
//     this.location = location;
//   }
//
//   set date(date) {
//     this.date = date;
//   }
//
//   set time(time) {
//     this.time = time;
//   }
//
//   set rsvp(rsvp) {
//     this.rsvp = rsvp;
//   }
// };


//var Connection = mongoose.model('Connection', connectionSchema);
// module.exports = Course;
module.exports = mongoose.model('Connection', connectionSchema);
