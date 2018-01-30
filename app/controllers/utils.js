function getMethods(obj) {
    var ret = [];
    for (var prop in obj) {
        if (obj[prop] && obj[prop].constructor && obj[prop].call && obj[prop].apply) {
            ret.push(prop);
        }
    }
    return ret;
}

module.exports = {
    getMethods: getMethods
}