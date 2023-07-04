const Local = require('./local.model');
const Users = require('./users.model');
const Orders = require('./orders.model');
const Meals = require('./meals.model');
const Reviews = require('./reviews');

const initModel = () => {

    Users.hasMany(Reviews);
    Reviews.belongsTo(Users);

    Users.hasMany(Orders);
    Orders.belongsTo(Users);
  
    Meals.hasOne(Orders);
    Orders.belongsTo(Meals);
  
    Local.hasMany(Meals);
    Meals.belongsTo(Restaurants);
  
    Local.hasMany(Reviews);
    Reviews.belongsTo(Restaurants);
  };
  
  module.exports = initModel;