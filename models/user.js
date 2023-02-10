'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });
    }

    /**
     * function for encrypt password
     * @param {password} password 
     * @returns 
     */
    static #encript = (password) => bcrypt.hashSync(password, 10);

    /**
     * function fo registration
     * @param {fullname, email, password} 
     * @returns 
     */
    static registration = ({ fullname, email, password }) => {
      const passwordHash = this.#encript(password);
      return this.create({
        fullname, email, password : passwordHash
      })
    }

    checkPassword = (password) => bcrypt.compareSync(password, this.password);
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};