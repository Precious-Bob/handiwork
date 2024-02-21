const User = require('../models/userModel');

exports.signup = async (req, res) => {
  try {
    // const { firstName, lastName, email, address, password, confirmPassword } =
    //   req.body;
    // if (password !== confirmPassword)
    //   return res.status(400).json({ message: 'Passwords do not match' });

    const newUser = await User.create(req.body);
    const token = newUser.generateAuthToken();

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
