'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RoomSession.init({
    kode_session: DataTypes.INTEGER,
    home_choice: DataTypes.STRING,
    away_choice: DataTypes.STRING,
    win: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RoomSession',
  });
  return RoomSession;
};