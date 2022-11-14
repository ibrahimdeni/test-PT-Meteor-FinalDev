const { book, bookcategory, user, profile, category } = require("../../models");

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
      status: "inactive",
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
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
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
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "category",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
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
