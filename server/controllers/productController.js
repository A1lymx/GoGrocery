const products = require('../data/products.json');

function getAllProducts(req, res) {
    res.json(products);
}

function getProductImage(req, res) {
    const id = req.params.id;
    try {
        res.status(200).sendFile(`./images/${id}.jpeg`, { root: __dirname + '/..' });
    }
    catch (err) {
        //console.log(err);
        res.status(404).send('Not found');
    }
}

module.exports = {
    getAllProducts,
    getProductImage
};  
