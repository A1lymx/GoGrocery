const deliveryOpts = require('../data/delivery.json');

function getOpts(req, res) {
    res.json(deliveryOpts);
}

module.exports = {
    getOpts
};