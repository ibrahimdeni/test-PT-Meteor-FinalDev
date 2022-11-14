const { category, book } = require("../../models");

exports.addCategory = async (req, res) => {
  const { name, color } = req.body;
  try {
    await category.create({
      name: name,
      color: color,
    });
    res.json({ msg: "Succeed Adding Category" });
  } catch (error) {
    console.log(error);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await category.findAll({
      include: {
        model: book,
        as: "books",
        include: {
          model: category,
          as: "category",
        },
      },
    });
    res.json(categories);
  } catch (error) {
    console.log(error);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const Category = await category.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: book,
        as: "books",
        include: {
          model: category,
          as: "category",
        },
      },
    });
    res.json(Category);
  } catch (error) {
    console.log(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    await category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "The Category has just been Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Succeed Deleting the Category" });
  } catch (error) {
    console.log(error.message);
  }
};
