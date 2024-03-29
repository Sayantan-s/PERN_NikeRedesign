const bcrypt = require('bcrypt');
const { ACCESSTOKEN_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthUtils {
    static async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }

    static async verifyPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    static generate_JWT({ payload, expiry = '5s', SECRET = ACCESSTOKEN_SECRET }) {
        return jwt.sign(payload, SECRET, { expiresIn: expiry });
    }

    static verify_JWT({ token, SECRET = ACCESSTOKEN_SECRET }) {
        return jwt.verify(token, SECRET);
    }

    static generate_refreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    static async createTokens({ payload }) {
        const accessToken = await AuthUtils.generate_JWT({ payload });

        const refreshToken = this.generate_refreshToken();

        return { accessToken, refreshToken };
    }
}

module.exports = AuthUtils;
