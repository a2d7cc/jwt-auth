const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const UserService = require('../services/user-service')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const {email, password} = req.body
            const userData = await UserService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json({...userData})

        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        
    }

}

module.exports = new UserController()