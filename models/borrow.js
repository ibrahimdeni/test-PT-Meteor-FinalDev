"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //borrow belongs to a book
      borrow.belongsTo(models.book, {
        as: "book",
        foreignKey: {
          name: "bookId",
        },
      });

      //borrow belongs to one user
      borrow.belongsTo(models.user, {
        as: "borrower",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  borrow.init(
    {
      bookId: DataTypes.STRING,
      userId: DataTypes.STRING,
      returnDate: DataTypes.STRING,
      borrowStatus: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "borrow",
    }
  );
  return borrow;
};
