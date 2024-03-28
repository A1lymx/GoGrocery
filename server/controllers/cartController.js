const cart = require('../data/cart.json');
const products = require('../data/products.json');

function getCart(req, res) {
    res.json(cart);
}

function addItemsToCart(req, res) {
    const newItem = req.body;
    console.log("Body received: " + JSON.stringify(newItem))
    cart.items.push(newItem)
    cart.total += newItem.price

    res.status(200).json(cart)
}

function addToCart(req, res) {
    const productId = req.params.id;
    const product = products.find(product => product.id === productId);
    const cartItem = cart.items.find(item => item.productId === productId);

    if (cartItem) {
        cartItem.quantity++;
        cartItem.total = cartItem.quantity * product.price;
    } else {
        cart.items.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            weight: product.weight,
            total: product.price
        });
    }

    cart.total += product.price;

    res.json(cart);
}

function removeFromCart(req, res) {
    console.log(cart)
    const productId = req.params.id;
    if (productId == 99) {
        cart.items.forEach((item) => {
            if (item.productId == 99) {
                console.log("Found")
                cart.items.splice(cart.items.indexOf(item), 1)
                cart.total -= item.price;
                res.json(cart);
            }
        })
    } else {
        const product = products.find(product => product.id === productId);
        const cartItemIndex = cart.items.findIndex(item => item.productId === productId);

        if (cartItemIndex !== -1) {
            const cartItem = cart.items[cartItemIndex];
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                cartItem.total = cartItem.quantity * product.price;
            } else {
                cart.items.splice(cartItemIndex, 1);
            }
            cart.total -= product.price;

            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart item not found' });
        }
    }
}

function checkout(req, res) {
    cart.items = [];
    cart.total = 0;
    res.json(cart);
}

module.exports = {
    getCart,
    addItemsToCart,
    addToCart,
    removeFromCart,
    checkout
};
