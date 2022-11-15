const { book, user, profile, borrow, category } = require("../../models");

exports.addBook = async (req, res) => {
  const {
    title,
    author,
    publisher,
    published,
    pages,
    image,
    isbn,
    categoryId,
  } = req.body;
  try {
    await book.create({
      title: title,
      author: author,
      publisher: publisher,
      published: published,
      pages: pages,
      image: image,
      isbn: isbn,
      categoryId: categoryId,
      bookStatus: "inactive",
    });

    res.json({ msg: "Succeed Adding Book" });
  } catch (error) {
    console.log(error);
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await book.findAll({
      include: [
        {
          model: category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: borrow,
          as: "borrows",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: user,
            as: "borrower",
            attributes: {
              exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
            },
          },
          include: {
            model: book,
            as: "book",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "categoryId", "userId"],
      },
    });
    res.json(books);
  } catch (error) {
    console.log(error);
  }
};

exports.getBookById = async (req, res) => {
  try {
    const books = await book.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: borrow,
          as: "borrows",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: user,
            as: "borrower",
            attributes: {
              exclude: ["createdAt", "updatedAt", "refresh_token", "password"],
            },
          },
          include: {
            model: book,
            as: "book",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "categoryId", "userId"],
      },
    });

    res.json(books);
  } catch (error) {
    console.log(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    await book.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "The Book has just been Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

// I HAVE AN ERROR IN THE TABLE RELATION TO RUN THIS DELETE BOOK CONTROL
// exports.deleteBook = async (req, res) => {
//   try {
//     await book.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });
//     res.status(200).json({ msg: "Succeed Deleting the Book" });
//   } catch (error) {
//     console.log(error.message);
//   }
// };
