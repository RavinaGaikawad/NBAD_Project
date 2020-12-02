var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  UserID: {type : String, required : true},
  UserName : {type : String, required : true},
  Password : {type : String, required : true},
  FirstName: String,
  LastName: String,
  Email: String,
  Address1: String,
  Address2: String,
  City: String,
  State: String,
  ZipCode: String,
  Country: String
});

module.exports = mongoose.model('User', userSchema);

// var user = function(UserID, FirstName, LastName, Email, Address1, Address2, City, State, ZipCode, Country) {
//   var userModel = {
//     UserID: UserID,
//     UserName : UserName,
//     Password : Password,
//     FirstName: FirstName,
//     LastName: LastName,
//     Email: Email,
//     Address1: Address1,
//     Address2: Address2,
//     City: City,
//     State: State,
//     ZipCode: ZipCode,
//     Country: Country
//   };
//   return userModel;
// };
//
// module.exports.user = user;
