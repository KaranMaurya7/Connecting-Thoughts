const express = require('express');
const router = express.Router();
const passport = require ('passport');

const commnetsController = require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commnetsController.create);
router.get('/destroy/:id', passport.checkAuthentication, commnetsController.destroy);

module.exports = router;