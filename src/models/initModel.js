const Local = require('./local.model');
const Users = require('./users.model');
const Orders = require('./orders.model');
const Meals = require('./meals.model');
const Reviews = require('./Reviews');

const initModel = () => {

    Users.hasMany(Reviews);
    Reviews.belongsTo(Users);

    Users.hasMany(Orders);
    Orders.belongsTo(Users);
  
    Meals.hasOne(Orders);
    Orders.belongsTo(Meals);
  
    Local.hasMany(Meals);
    Meals.belongsTo(Local);
  
    Local.hasMany(Reviews);
    Reviews.belongsTo(Local);
  };
  
  module.exports = initModel;