const ApiError = require('../exceptions/api-error')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest("The user with this email already exist")
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        const user = await User.create({email, password: hashPassword, activationLink})
        
        // Send mail for activation
        // Transform data
        const userData = 
        // Send response

    }
}

module.exports = new UserService()