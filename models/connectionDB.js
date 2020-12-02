var Connection = require('./connection');
const express = require('express');
const app = express();

//get all Connections
var getConnections = async function() {
  return await Connection.find({});
}


var getConnectionCategories = async function() {
  return await Connection.find().distinct('connectionTopic', function(err, topics) {});
}

var getConnection = async function(connectionID) {
  let isPresent = false;
  let result;
  let connections = await Connection.find({});
  connections.forEach(function(element) {
    if (element.connectionID == connectionID) {
      result = element;
      isPresent = true;
    }
  });
  if (isPresent) {
    return result;
  } else {
    return -1;
  }
};

//add new connection

var addConnection = async function(connectionName, connectionTopic, hostedby, location, details, date, time) {
  let connections = await Connection.find({});
  let id = "connection" + (connections.length + 1);
  let newCon = new Connection({
    connectionID: id,
    connectionName: connectionName,
    connectionTopic: connectionTopic,
    hostedby: hostedby,
    location: location,
    details: details,
    date: date,
    time: time
  });

  let newconnection;
  await newCon.save().then((con) => {
    newconnection = con
  });
  return newconnection;
}

var formatAMPM = function(time) {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

var getDay = function(dayno) {
  var weekday = new Array(7);
  weekday[0] = "Monday";
  weekday[1] = "Tuesday";
  weekday[2] = "Wednesday";
  weekday[3] = "Thursday";
  weekday[4] = "Friday";
  weekday[5] = "Saturday";
  weekday[6] = "Sunday";

  return weekday[dayno];
}

var getMonth = function(month) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[month];
}

var isValidTime = (etime, stime) => {
  let StartHour = stime.req.body.starttime.split(':')[0];
  let StartMinute = stime.req.body.endtime.split(':')[1];
  let EndHour = etime.split(':')[0];
  let EndMinute = etime.split(':')[1];
  let start = StartHour + "" + StartMinute;
  let end = EndHour + "" + EndMinute;

  if ((parseInt(end)) <= (parseInt(start))) {
    return true;
  } else {
    return false;
  }
};

var isInValidDate = function(d){
  let today = new Date();
  if( today.getTime() > d.getTime()){
    return true;
  }
  else{
    return false;
  }
}


module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.addConnection = addConnection;
module.exports.getConnectionCategories = getConnectionCategories;
module.exports.formatAMPM = formatAMPM;
module.exports.getDay = getDay;
module.exports.getMonth = getMonth;
module.exports.isValidTime = isValidTime;
module.exports.isInValidDate = isInValidDate;
