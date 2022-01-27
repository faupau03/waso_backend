var db = require('../db.js');


/**
 * Create a game with request body
 * @author Paul Paffe
 * 
 * @param name - name of game
 * @param user - array of user ids
 * @param money - boolean for if game has money (optional)
 * @function
 */
async function create(name, user, money) {
    try {

        //  Set money to false if no money is given
        if (money == null) {
            money = false;
        }

        //  Check user is an array and more than one user is given
        if (!Array.isArray(user) || user.length < 2) {
            console.log("user is not an array or less than 2");
            throw new Error("400");
        }

        const game = await db.any('INSERT INTO games(name,money) VALUES($1,$2) RETURNING id', [name, money]);

        for (let i in user) {
            const user_sql = await db.one('INSERT INTO user_games(game_id,user_id,data) VALUES($1,$2,$3) RETURNING user_id', [game[0].id, user[i], 15]);
        }

        return game[0].id;
    } catch (e) {
        throw e;
    }
}


/**
 * Read a game of given id
 * @author Paul Paffe
 * 
 * @param id - id of game (optional) 
 * @function
 * @description
    1. If a game is specified, it will get the game data, and the user data associated with that game.
    2. If no game is specified, it will get all games and all user data associated with each game.
    3. If a game is specified, and it can't be found, it will throw a 404 error.
    4. If no game is specified, and there are no games, it will throw a 404 error.
 */
async function read(id) {
    if (id != null) {
        // Get data from one game
        try {
            // Run query to get game
            const game = await db.any('SELECT * FROM games WHERE id=$1', [id]);

            // Run query to get users
            const user = await db.any('SELECT user_id, status, data FROM user_games WHERE game_id=$1', [id]);

            // Check if queries returned data
            if (game.length >= 1 && user.length >= 1) {
                // Create response object
                var data_json = {};

                //Iterate through users
                for (let i = 0; i < user.length; i++) {
                    // Add user data to response object
                    data_json[user[i].user_id] = user[i].data;
                }
                game[0].data = data_json;
                return game[0];
            }
            // If no game is returned from query
            else if (game.length <= 0) {
                throw new Error("404");
            } else {
                throw new Error("500");
            }
        } catch (e) {
            throw e;
        }
    } else {
        // Get data from all games
        try {
            // Run query to get games
            const games = await db.any('SELECT * FROM games');
            // Iterate through games
            for (let l = 0; l < games.length; l++) {
                // Run query to get users
                const user = await db.any('SELECT user_id, status, data FROM user_games WHERE game_id=$1', [games[l]["id"]]);
                //  Check if query returned data
                if (games.length >= 1 && user.length >= 1) {
                    // Create response object
                    var data_json = {};
                    // Iterate through users
                    for (let i = 0; i < user.length; i++) {
                        // Add user data to response object
                        data_json[user[i].user_id] = user[i].data;
                    }
                    games[l].data = data_json;

                } else if (games[l].length <= 0) {
                    throw new Error("404");
                } else {
                    throw new Error("500");
                }
            }
            return games;
        } catch (e) {
            throw e;
        }
    }
}

/**
 * Updates a game with request body
 * @author Paul Paffe
 * 
 * @param id - id of game
 * @param data - data to update
 * @param money - boolean for if game has money (optional)
 * @param finished - boolean for if game is finished (optional)
 * 
 * @description
 *  1. Select the game with the given id
    2. Check if the game is finished (finished == true)
    3. If the game is finished, calculate the money for each user
    4. Update the money for each user
    5. If the game is finished, update the winner
 */
async function update(id, data, money, finished) {
    try {
        if (money != null) {
            const game = await db.one(
                "UPDATE games SET money=$1, updated=DEFAULT, finished=$2 WHERE id = $3 RETURNING id",
                [money, finished, id]
            );
        } else {
            
            const game = await db.one(
                "UPDATE games SET updated=DEFAULT, finished=$1 WHERE id = $2 RETURNING id",
                [finished, id]
            );
        }
        const user = await db.any(
            "SELECT user_id FROM user_games WHERE game_id=$1",
            [id]
        );

        if ((user.length > 1) && user.length == Object.keys(data).length) {

            var money_sum = 0;
            for (let i in user) {

                var user_id = user[i].user_id;

                //Check if user has data
                if (data[user_id] == null) {
                    //no data for this user
                    throw new Error("400");
                }

                var data_length = data[user_id].length;
                var last_value = data[user_id][data_length - 1];

                var money = 0;
                var status = 1; // 1 = playing
                if (last_value == "0") {
                    status = 2; // 2 = won
                } else if ((last_value == "-") || (last_value == "_")) {
                    status = 1; // 1 = playing
                } else if ((last_value == "x") || (last_value == "X") || (parseInt(last_value) > 30)) {
                    status = 0; // 0 = dead
                    money = -0.3;

                }

                if (status == 1 && finished == true) {
                    status = 3; // 3 = lost
                    if (last_value != "-" && last_value != "_") {
                        money = -1 * parseInt(last_value) / 10;
                    } else if (data[user_id][data_length - 2] != "-" && data[user_id][data_length - 2] != "_") {
                        money = -1 * parseInt(data[user_id][data_length - 2]) / 10;
                    }
                }
                money_sum += money;
                const one_user = await db.any(
                    "UPDATE user_games SET money=$5, status=$4, data=$3 WHERE user_id=$2 AND game_id=$1 RETURNING user_id",
                    [id, user_id, data[user_id], status, money]
                );
            }
            money_sum = money_sum * -1;
            //console.log("money_sum: " + money_sum);
            if (finished == true && money_sum > 0) {
                const winner = await db.one("UPDATE user_games SET money=$1 WHERE status=2 AND game_id=$2 RETURNING user_id", [money_sum, id]);
            }

            return id;
        } else {
            //console.log("else");
            throw new Error("400");
        }
    } catch (e) {
        throw e;
    }
}


/**
 * Delete a game of given id
 * @author Paul Paffe
 * 
 * @param id - id of game
 * @function
 */
async function deleteg(id) {
    try {

        //  Check user is an array and more than one user is given
        if (id == null) {
            //console.log("id is null");
            throw new Error("400");
        }
        const user = await db.none('DELETE FROM user_games WHERE game_id=$1', [id]);

        const game = await db.none('DELETE FROM games WHERE id=$1', [id]);
        return id;
    } 
    catch (e) {
        throw e;
    }
}








module.exports = {
    create,
    read,
    update,
    deleteg
};