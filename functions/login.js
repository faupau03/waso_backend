/**
 * File: functions\auth.js
 * Author: Paul Paffe
 * Purpose: This file contains the authentication functions for the login endpoint. Login or delete a session.
 */
var db = require('../db.js');
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

/* const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
} */



async function login(email, password) {
    const hashedPassword = getHashedPassword(password);
    const user = await db.any('SELECT * FROM public.users WHERE email = $1 AND password = $2', [email, hashedPassword]);
    console.log(user);
    if (user[0].email === email) {
        return {
            id: user[0].id,
            gid: user[0].group,
            email: user[0].email,
        }
    }
    return null;
}

async function logout() {
    
}

module.exports = {
    login,
    logout
}