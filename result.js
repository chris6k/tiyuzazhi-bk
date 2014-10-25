var result = function (succ, data, msg) {
    return {result: succ || false, data: data, msg: msg};
};
module.exports = result;