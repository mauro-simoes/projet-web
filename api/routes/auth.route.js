const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User, roleEnum} = require('../models/user.model');

const router = express.Router();

router.post('/creer-compte', async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'adresse e-mail est déjà utilisée" });
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role:roleEnum.USER,...otherData });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
    const role = "USER";

    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }
    if(user.accountStatus == 'RADIE'){
      return res.status(400).json({ message: 'Votre compte est suspendu' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
    const role = user.role;
    res.json({ token, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
