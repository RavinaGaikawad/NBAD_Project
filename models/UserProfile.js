var userconnectionModel = require('./userconnection');

class UserProfile {
  constructor(UserID, UserConnectionList) {
    this.UserID = UserID;
    this.UserConnectionList = UserConnectionList;
  }

  connectionExists(connection) {
    if(this.UserConnectionList == []){
      return false;
    }
    else{
      this.UserConnectionList.forEach(function(item, index) {
          if(item.Connection.connectionID == connection.connectionID){
            return true;
          }
      });
    }
  }

  addConnection(connection, rsvp) {
    if(this.getUserConnections() == []){
      userconnection = userconnectionModel.userconnection(connection, rsvp);
      this.UserConnectionList.push(userconnection);
      this.rsvp = rsvp;
    }
    else{
      if(this.connectionExists(connection)){
        updateRSVP(connection);
      }
      else{
        var userconnection = userconnectionModel.userconnection(connection, rsvp);
        this.UserConnectionList.push(userconnection);
      }
    }
  };

  removeConnection(connection) {
      this.UserConnectionList.forEach(function (item, index, result) {
      if(item.Connection.connectionID == connection.connectionID){
           result.splice(index,1);
          }
      });
  };

  updateRSVP(connection, rsvp) {
    this.UserConnectionList.forEach(function (item, index) {
        if(item.Connection.connectionID == connection.connectionID){
            item.rsvp = rsvp;
        }
    });
  };

  getUserConnections() {
      return this.UserConnectionList;
  };
}

module.exports = UserProfile;
