const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token.model')


class TokenService {
     generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.jwt_access_secret, { expiresIn: '15s' })
        const refreshToken = jwt.sign(payload, process.env.jwt_refresh_secret, { expiresIn: '30m' })

        return { accessToken, refreshToken }
    }

     validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.jwt_access_secret)
            return userData
        } catch (error) {
            return null
        }
    }

     validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.jwt_refresh_secret)
            return userData
        } catch (error) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData
        }
        const token = await TokenModel.create({user: userId, refreshToken})
        return token;
     }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData
     }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData
    }
}

module.exports = new TokenService()