const db = require("../db");
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

async function create(username, email, password, gid) {
    if ((!username || !email || !password) && gid != 2) {
        throw new Error('Missing parameters');
    }
    var user;
    if (gid == 2) 
        user = await db.one('INSERT INTO public.users (id, name, gid) VALUES (DEFAULT, $1, $2) RETURNING *', [username, gid]);
    }
    else {
        
        const hashedPassword = getHashedPassword(password);
        user = await db.one('INSERT INTO public.users (id, name, email, password, gid) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, gid]);
    }
    if (!user) {
        throw new Error('User not created');
    }
    else {
        return user;
    }
}


async function get(id) {
    if (id) {
        const user = await db.one('SELECT id, name, created, email, gid FROM public.users WHERE id = $1', [id]);
        if (!user) {
            throw new Error('User not found');
        }
        else {
            //console.log(user);
            user.money = 0;
            user.games = await db.any('SELECT game_id, status, money::numeric::float FROM public.user_games WHERE user_id = $1', [id]);
            //console.log(user);
            for (i in user.games) {
                const game = await db.any('SELECT name, created, updated, finished, money FROM public.games WHERE id = $1', [user.games[i].game_id])
                game[0].use_money = game[0].money;
                delete game[0].money;
                user.games[i] = Object.assign(user.games[i],game[0]);
                user.games[i].id = user.games[i].game_id;
                delete user.games[i].game_id;

                if (user.games[i].use_money) {
                    user.money += user.games[i].money;
                }
                
            }
            console.log(user);
            return user;
        }
    }
    else {
        const user = await db.any('SELECT id, name, created, email, gid FROM public.users', []);
        if (!user) {
            throw new Error('User not found');
        }
        else {
            for (u in user) {
                var id = user[u].id;
                //console.log(user);
                user[u].money = 0;
                user[u].games = await db.any('SELECT game_id, status, money::numeric::float FROM public.user_games WHERE user_id = $1', [id]);
                //console.log(user);
                for (i in user[u].games) {
                    const game = await db.any('SELECT name, created, updated, finished, money FROM public.games WHERE id = $1', [user[u].games[i].game_id])
                    game[0].use_money = game[0].money;
                    delete game[0].money;
                    user[u].games[i] = Object.assign(user[u].games[i],game[0]);
                    user[u].games[i].id = user[u].games[i].game_id;
                    delete user[u].games[i].game_id;
        
                    if (user[u].games[i].use_money) {
                        user[u].money += user[u].games[i].money;
                    }
                    
                }
                console.log(user[u]);
            }
            return user;
            
        }
    }
}


module.exports = {
    create,
    get
}


