const Router = require('express').Router
const router = new Router()
const { body } = require('express-validator');
const UserController = require('../controllers/user-controller')

router.post('/registration', 
body('email').isEmail(),
body('password').isLength({ min: 5 }),
UserController.registration)

router.post('/login', UserController.login)

module.exports = router