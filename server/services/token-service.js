const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token.model')


class TokenService {
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.jwt_access_secret, { expiresIn: '15s' })
        const refreshToken = jwt.sign(payload, process.env.jwt_refresh_secret, { expiresIn: '30m' })

        return { accessToken, refreshToken }
    }

    async validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.jwt_access_secret)
            return userData
        } catch (error) {
            return null
        }
    }

    async validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.jwt_refresh_secret)
            return userData
        } catch (error) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = TokenModel.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData
        }
        const token = TokenModel.create({user: userId, refreshToken})
        return token;
     }

    async findToken(refreshToken) {
        const tokenData = TokenModel.findOne({refreshToken})
        return tokenData
     }

    async removeToken(refreshToken) {
        const tokenData = TokenModel.deleteOne({refreshToken})
        return tokenData
    }
}

module.exports = new TokenService()