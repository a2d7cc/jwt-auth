const Router = require('express').Router
const router = new Router()
const UserController = require('../controllers/user-controller')

router.post('/login', UserController.login)
router.post('/registration', UserController.registration)

module.exports = router