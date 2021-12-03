const db = require("../db");
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

async function create(username, email, password, gid) {
    if (!username || !email || !password) {
        throw new Error('Missing parameters');
    }
    const hashedPassword = getHashedPassword(password);
    const user = await db.one('INSERT INTO public.users (id, name, email, password, gid) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, gid]);
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


