const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = 'Harryisagoodb$oy'; //Use enviornment variable (Hard-coding not recommended)

// ROUTE 1 :Create a user using: POST "/api/auth/createuser". Doesn't require authorisation.
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name.").isLength({ min: 3 }),
    body("password", "Password must be atleast five characters.").isLength({
      min: 5,
    }),
    body("email", "Enter a valid e-mail.").isEmail(),
  ],

  // Validation and error handling for data
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      
      //Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: { id: user.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error.");
    }
  }
);

// ROUTE 2 : Authenticate existing user using: POST "/api/auth/login"
router.post(
  "/login",
  [
    body("password", "Password must be atleast five characters.").exists(),
    body("email", "Enter a valid e-mail.").isEmail(),
  ],

  // Validation and error handling for data
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    //Authenticate existing user
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please input correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please input correct credentials" });
      }
      const data = {
        user: { id: user.id },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server error");
    }
  }
);

//****** Was getting many errors and not knowing a single solution. *******

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    user = {
      id: user.id
  }
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
