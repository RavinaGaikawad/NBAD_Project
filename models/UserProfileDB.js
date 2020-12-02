var UserConnection = require('./userconnection');
var connectionDB = require('../models/connectionDB.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userProfileSchema = new Schema({
  UserID: String,
  UserConnectionList: [{
    type: Schema.ObjectId,
    ref: 'userconnection'
  }]
});

var userprofile = mongoose.model('userprofile', userProfileSchema);

class UserProfile {
  constructor(UserID, UserConnectionList) {
    this.UserID = UserID;
    this.UserConnectionList = UserConnectionList;
  }

  async connectionExists(connection, userID) {
    let conList = await this.getConnectionsByUserID(userID);
    let exists = false;
    if (conList != null || conList.length > 0) {
      conList.forEach(function(item, index) {
        if (item.equals(connection._id)) {
          exists = true;
        }
      });
    }

    return exists;
  }

  async addUserConnection(connection, rsvp, userID) {
    let conList = await this.getConnectionsByUserID(userID);
    let id;
    if (conList == null || conList == undefined || conList.length == 0) {
      //console.log("if conList is empty");
      let newUserConnection = new UserConnection({
        Connection: connection._id,
        rsvp: rsvp
      });

      await newUserConnection.save().then((list) => {
        id = list._id
      }).catch((err) => console.log(err));

      return id;
    } else {
      if (await this.connectionExists(connection, userID)) {
        //console.log("if exists");
        await this.updateRSVP(connection, rsvp, userID);
      } else {
        //console.log("create new");
        let newUserConnection = new UserConnection({
          Connection: connection._id,
          rsvp: rsvp
        });

        await newUserConnection.save().then((list) => {
          id = list._id
        }).catch((err) => console.log(err));

        return id;
      }
    }
  };

  async addRSVP(userID, userconnectionID, rsvp) {
    let conList = await this.getConnectionsByUserID(userID);
    if (conList == null || conList == undefined || conList.length == 0) {
      //create new schema and save
      //console.log("Add new RSVP");
      let newprofile = new userprofile({
        UserID: userID,
        UserConnectionList: [userconnectionID]
      });
      await newprofile.save().then();
    } else {
      //console.log("Add to RSVP collection");
      let id = await this.getUserProfileId(userID);
      await userprofile.updateOne({
        '_id': id
      }, {
        $push: {
          UserConnectionList: userconnectionID
        }
      })
    }
  }

  async removeConnection(connection, userID) {
    let userconID = await this.getUserConnectionId(userID, connection._id);
    let conList = await this.getConnectionsByUserID(userID);
    if (conList.length == 1) {
      //console.log("Delete all if length is 1");
      await userprofile.deleteMany({
        'UserID': userID
      });
      await UserConnection.deleteOne({
        '_id': userconID
      });
    } else {
      //console.log("Delete one from list");
      await userprofile.updateOne({
        'UserID': userID
      }, {
        $pull: {
          'UserConnectionList': userconID
        }
      });

      await UserConnection.deleteOne({
        '_id': userconID
      });
    }


    return true;
  };

  async updateRSVP(connection, rsvp, userID) {
    let id = await this.getUserConnectionId(userID, connection._id);
    await UserConnection.findOneAndUpdate({
      '_id': id
    }, {
      $set: {
        'rsvp': rsvp
      }
    });

    return id;
  };

  async getUserProfileId(userID) {
    return await userprofile.findOne({
      'UserID': userID
    });
  }
  async getConnectionsByUserID(userID) {
    let userconnectionlist = [];
    var res = await userprofile.findOne({
        'UserID': userID
      })
      .populate({
        path: 'UserConnectionList',
        model: 'userconnection'
      })
      .populate({
        path: 'UserConnectionList.Connection',
        model: 'Connection'
      })

    if (res != null) {
      res.UserConnectionList.forEach(function(item, index) {
        userconnectionlist.push(item.Connection);
      });
    }
    return userconnectionlist;
  };

  async getUserConnectionId(userID, connectionID) {
    let res = await userprofile.findOne({
        'UserID': userID
      })
      .populate({
        path: 'UserConnectionList',
        model: 'userconnection'
      })

    let id;
    res.UserConnectionList.forEach(function(item, index) {

      if (item.Connection.equals(connectionID)) {
        id = item._id;
      }
    });

    return id;
  }

  async getUserConnections(userID) {
    let allUserConnections = [];
    var connectionObjs = await connectionDB.getConnections();

    let conList = await userprofile.findOne({
        'UserID': userID
      })
      .populate({
        path: 'UserConnectionList',
        model: 'userconnection'
      })
      .populate({
        path: 'UserConnectionList.Connection',
        model: 'Connection'
      })

    if (conList != undefined || conList != null) {
      conList.UserConnectionList.forEach((item, i) => {
        connectionObjs.forEach((item2, i2) => {
          if (item.Connection.equals(item2._id)) {
            let record = {
              Connection: item2,
              rsvp: item.rsvp
            }
            allUserConnections.push(record);
          }
        });
      });
    }

    return allUserConnections;
  }
}



module.exports = UserProfile;
