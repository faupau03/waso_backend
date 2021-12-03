const db = require("../db");
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

async function create(username, email, password) {
    if (!username || !email || !password) {
        throw new Error('Missing parameters');
    }
    const hashedPassword = getHashedPassword(password);
    const user = await db.one('INSERT INTO public.users (id, name, email, password) VALUES (DEFAULT, $1, $2, $3) RETURNING *', [username, email, hashedPassword]);
    if (!user) {
        throw new Error('User not created');
    }
    else {
        return user;
    }
}

module.exports = {
    create
}


