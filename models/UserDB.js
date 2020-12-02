const User = require('./User');

var getUsers = async function() {
  return await User.find({});
};

var getUserByUsernameAndPassword = async function(username, password) {
  return await User.find({ $and: [{"UserName" : username},{"Password": password}]});
};

module.exports.getUsers = getUsers;
module.exports.getUserByUsernameAndPassword = getUserByUsernameAndPassword;
