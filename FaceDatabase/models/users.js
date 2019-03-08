const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  
  const User = sequelize.define('users', {
    annotation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name'
    },
    pictureLink: DataTypes.STRING, //link to picture
    userName: DataTypes.STRING, 
    faceId: DataTypes.STRING,
    password: DataTypes.STRING
  });

  return User;

};
