const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/middleware');
const userService = require('../services/user.service');

const router = express.Router();

router.use(authenticateToken);

router.get('/get-all', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/get', async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/mise-a-jour',authenticateToken, async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.user.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: "Utilisateur non trouvé" });
  }
});

router.post('/reinitialiser-mot-de-passe', [
  check('currentPassword').not().isEmpty(),
  check('newPassword').isLength({ min: 8 })
], authenticateToken, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const currentUser = await userService.getCurrentUser(req);
    const isMatch = await bcrypt.compare(req.body.currentPassword, currentUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Le mot de passe actuel est erroné" });
    }
    const motDePasseChange = await userService.resetPassword(currentUser._id, req.body.newPassword);
    res.status(200).json(motDePasseChange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/valider-compte/',authenticateToken,authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const result = await userService.validateAccount(req.body.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/radier-compte/',authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const result = await userService.banAccount(req.body.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/depot', authenticateToken, async(req,res) => {
  try {
    const result = await userService.topUpBalance(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
