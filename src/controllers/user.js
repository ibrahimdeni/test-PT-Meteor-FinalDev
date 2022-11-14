const { user, profile, book, borrow } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      include: [
        {
          model: profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId"],
          },
        },
        {
          model: book,
          as: "books",
        },
        {
          model: borrow,
          as: "borrows",
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const users = await user.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "userId"],
          },
        },
        {
          model: book,
          as: "books",
        },
        {
          model: borrow,
          as: "borrows",
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    await user.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await user.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
