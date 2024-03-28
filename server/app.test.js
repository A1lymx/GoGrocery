const request = require('supertest');
const app = require('./app');

describe('GET /api/products', () => {
    it('should return 200 OK, with correct product json', async () => {
        const productList = require('./data/products.json')
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(productList)
    });
});

describe('GET /api/cart', () => {
    it('should return 200 OK, with correct cart json', async () => {
        const cartList = require('./data/cart.json')
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(cartList)
    });
});

describe('GET /api/product/img/:id', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/api/product/img/01');
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404 Not Found', async () => {
        const res = await request(app).get('/api/product/img/99');
        expect(res.statusCode).toEqual(404);
    });
});

describe('POST /api/cart/items/addItems', () => {
    it('should return 200 OK, with new item added to the cart', async () => {
        const res = await request(app).post('/api/cart/items/addItems').send({
            "id": "01",
            "name": "Apple 5 Pack",
            "price": 0.69,
            "category": "fruit",
            "weight": 700,
            "pic": "http://localhost:3000/api/product/img/01"
        });
        const cart = {
            "items": [
                {
                    "id": "01",
                    "name": "Apple 5 Pack",
                    "price": 0.69,
                    "category": "fruit",
                    "weight": 700,
                    "pic": "http://localhost:3000/api/product/img/01"
                }
            ],
            "total": 0.69
        }
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(cart)
    });
});