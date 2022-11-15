"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    static associate(models) {
      book.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
      book.hasMany(models.borrow, {
        as: "borrows",
        foreignKey: {
          name: "bookId",
        },
      });

      book.belongsTo(models.category, {
        as: "category",
        foreignKey: {
          name: "categoryId",
        },
      });

      // book.belongsToMany(models.category, {
      //   as: "categories",
      //   through: {
      //     model: "bookcategories",
      //     as: "bridge",
      //   },
      //   foreignKey: "categoryId",
      // });
    }
  }
  book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      publisher: DataTypes.STRING,
      published: DataTypes.STRING,
      pages: DataTypes.STRING,
      isbn: DataTypes.STRING,
      image: DataTypes.STRING,
      bookStatus: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "book",
    }
  );
  return book;
};
