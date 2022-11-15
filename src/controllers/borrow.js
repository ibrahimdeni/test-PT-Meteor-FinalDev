const { json } = require("sequelize");
const { borrow, user, book, category } = require("../../models");

exports.addBorrow = async (req, res) => {
  const { bookId, userId, returnDate } = req.body;
  try {
    const newBorrow = await borrow.create({
      bookId: bookId,
      userId: userId,
      returnDate: returnDate,
      borrowStatus: "pending",
    });

    let maxBorrow = await user.findOne({
      where: {
        id: newBorrow.bookId,
      },
      include: {
        model: borrow,
        as: "borrows",
      },
    });

    console.log("test borrow", maxBorrow.borrows.length);
    maxBorrow = maxBorrow.borrows.length;
    if (maxBorrow >= 2) {
      return res.status(400).json({
        msg: " you've just borrowed two books, max borrow just two book okay~ ",
      });
    }

    res.status(200).send({ newBorrow, maxBorrow });

    // console.log({ maxBorrow });
    // return;

    // // const idBook = newBorrow.bookId;
    // let values =
    // await book.update({
    //   status: "borrowed",
    //   where: {
    //     id: newBorrow.bookId,
    //   },
    // });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "failed borrow" });
  }
};

exports.getBorrows = async (req, res) => {
  try {
    const borrows = await borrow.findAll({
      include: [
        {
          model: user,
          as: "borrower",
          attributes: {
            exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
          },
        },
        {
          model: book,
          as: "book",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });
    res.status(200).json({ borrows });
  } catch (error) {
    console.log(error);
  }
};

exports.getBorrowById = async (req, res) => {
  try {
    const borrows = await borrow.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: user,
          as: "borrower",
          attributes: {
            exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
          },
        },
        {
          model: book,
          as: "book",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
    });
    res.status(200).json({ borrows });
  } catch (error) {
    console.log(error);
  }
};

exports.updateBorrow = async (req, res) => {
  try {
    await borrow.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    const infoBorrow = await borrow.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: user,
          as: "borrower",
          attributes: {
            exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
          },
        },
        {
          model: book,
          as: "book",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    console.log(infoBorrow.borrower.id);
    console.log(infoBorrow.book.id);

    const borrowerId = infoBorrow.borrower.id;
    const theBookId = infoBorrow.book.id;

    try {
      await user.update(req.body, {
        where: {
          id: borrowerId,
        },
      });
      try {
        await book.update(req.body, {
          where: {
            id: theBookId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    }

    res.status(200).json({ msg: "Succeed updated the borrow status" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.try = async (req, res) => {
  test;
};
