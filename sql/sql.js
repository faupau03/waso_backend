const {QueryFile} = require('pg-promise');
const {join: joinPath} = require('path');

// Helper for linking to external query files:
function sql(file) {
    const fullPath = joinPath(__dirname, file); // generating full path;
    return new QueryFile(fullPath, {minify: true});
}

module.exports = {
    init: sql('init.sql')
};