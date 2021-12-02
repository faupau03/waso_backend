/**
 * File: functions\auth.js
 * Author: Paul Paffe
 * Purpose: This file contains the authentication functions for the login endpoint. Login or delete a session.
 */

const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}


async function create(username, password, email) {
    const hashedPassword = getHashedPassword(password);
    const user = await User.findOne({
        where: {
            username,
            password: hashedPassword,
            email
        }
    });
    if (user) {
        const token = generateAuthToken();
        await User.update({
            token
        }, {
            where: {
                username
            }
        });
        return token;
    }
    return null;
}

async function delete() {

}