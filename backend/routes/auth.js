const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Create a user using: POST "/api/auth". Doesn't require authorisation.
router.post(
  "/createuser",
  body("name", "Enter a valid name.").isLength({ min: 3 }),
  body("password", "Password must be atleast five characters.").isLength({
    min: 5,
  }),
  body("email", "Enter a valid e-mail.").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exists"})
    }
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
    res.json(user)
    .catch((err) => {
        console.log(err);});
        res.status(500).send({
            error: "Please enter a unique value",
              message: err.message,  });
    }
    );

module.exports = router;
