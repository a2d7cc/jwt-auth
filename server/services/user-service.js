const ApiError = require('../exceptions/api-error')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const UserDto = require('../dtos/user-dto')
const MailService = require('../services/mail-service')
const TokenService = require('../services/token-service')

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest("The user with this email already exist")
        }

        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        const user = await User.create({email, password: hashPassword, activationLink})
        MailService.sendActivationLink(email, process.env.api_url + '/api/activate/' + activationLink)

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...userDto,
            ...tokens
        }

    }

    async login(email, password) {
        const user = await User.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('The user with this email not founded')
        }
        const checkPass = await bcrypt.compare(password, user.password)
        if(!checkPass) {
            throw ApiError.BadRequest('The password is incorrect')
        }
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...userDto,
            ...tokens
        }
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if(!user) {
            throw ApiError.BadRequest("There is no user with this activation link")
        }
        user.isActivated = true
        await user.save()
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await User.findOne({refreshToken})
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...userDto, ...tokens}
    }
}

module.exports = new UserService()