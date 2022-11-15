// import model
const { user, profile } = require("../../models");

// import joi validation
const Joi = require("joi");
// import bcrypt
const bcrypt = require("bcrypt");
//import jsonwebtoken
const jwt = require("jsonwebtoken");

//CONTROL REGISTER
exports.register = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  //pick up the user by email
  const userExist = await user.findOne({
    where: {
      email: req.body.email,
    },
  });

  console.log(userExist); //makin' sure that the User is Exist

  //checks that the email has already registered or not yet
  if (userExist) {
    return res.status(400).send({
      status: "failed",
      message: "Email already registered",
    });
  }

  try {
    // we generate salt (random value) with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // we hash password from request with salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new User
    const newUser = await user.create({
      username: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      userStatus: "inactive",
      role: "user",
    });

    //Create new Profile for the User
    await profile.create({
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      address: "",
      image: "blank.png",
      userId: newUser.id,
    });

    //let's send and show the data
    res.status(200).send({
      status: "success...",
      data: {
        name: newUser.username,
        email: newUser.email,
        userStatus: newUser.userStatus,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

//CONTROL LOGIN
exports.login = async (req, res) => {
  try {
    // our validation schema here
    const schema = Joi.object({
      email: Joi.string().email().min(5).required(),
      password: Joi.string().min(4).required(),
    });

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    //pick up the user by the email
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    // compare password between entered from client and from database
    const match = await bcrypt.compare(req.body.password, userExist.password);

    // check if not valid then return response with status 400 (bad request)
    if (!match) {
      return res.status(400).json({ msg: "Wrong password!" });
    }

    //ambil data
    const userId = userExist.id;
    const name = userExist.username;
    const email = userExist.email;

    // generate token
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m", //token will be expired in 10 mins
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d", //this one for higher security, and will be expired in 1 day
      }
    );
    console.log("REFRESH TOKEN", refreshToken);
    //refresh token for higher security
    await user.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send({
      status: "Success",
      data: {
        user: {
          name: userExist.username,
          email: userExist.email,
          role: userExist.role,
          accessToken,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "failed",
      message: "this email is not registered yet",
    });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const userExist = await user.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user) return res.sendStatus(204);
  const userId = userExist.id;
  await user.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};

exports.checkAuth = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(404);
  const userExist = await user.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!userExist) {
    return res.sendStatus(404);
  } else {
    return res.sendStatus(200);
  }
};
