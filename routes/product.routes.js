const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const CustomError = require('../helpers/custom_error_handler');
const isAuth = require('../middlewares/isAuth');
const cloudinary =  require('../helpers/init_cloudinary');
const { promisify } =  require('util')
const client = require('../helpers/init_redis');
const { products, cart, order } = new PrismaClient();

client.get = promisify(client.get).bind(client);

router
    .route('/products')
    .get(async (req, res, next) => {

        //const getCache = await client.get('allProducts');

        //console.log("GET FROM CACHE");

        //if(getCache) return res.status(200).send({ data : JSON.parse(getCache) })

        console.log("GET FROM MONGO");

        const data = await products.findMany();

        res.status(200).send({ data });

        //client.set('allProducts', JSON.stringify(data));
    })
    .post(async (req, res, next) => {
        const { body } = req;

        console.log(req.body)

        try{
            const { cover, otherImgs, ...data } = body;

            const checkProductPresence = await products.findFirst({
                where : {
                    name : data.name,
                    tagname : data.tagname
                }
            })

            if(checkProductPresence){
                return next(CustomError.alreadyExists('Product already exists')) 
            }

            const uploadToCloudinaryCover = await cloudinary.uploader.upload(cover,{
                upload_preset : 'product_cover'
            })

            const uploadToCloudinaryOtherImgs = otherImgs.map(img => {
                cloudinary.uploader.upload(img,{
                    upload_preset : 'product_imgs'
                })
            })

            const uploadMultiple = await Promise.all(uploadToCloudinaryOtherImgs);

        }

        catch(e){
            next(e);
        }
    });

router
    .route('/cart')
    .get(async (req, res, next) => {
        const { user_id } = req.query;
        try {
            const cartData = await cart.findMany({
                where: { user_id },
                orderBy: {
                    created_at: 'desc'
                },
                select: {
                    id: true,
                    quantity: true,
                    size: true,
                    products: {
                        select: {
                            name: true,
                            tagname: true,
                            price: true,
                            cover: true
                        }
                    }
                }
            });

            res.send({ data: cartData });
        } catch (error) {
            next(CustomError.newError(400, error.message));
        }
    })
    .post(async (req, res, next) => {
        console.log(req.body);
        try {
            const { user_id, product_id, quantity, size } = req.body;

            const getCart = await cart.findMany({
                where: { user_id }
            });

            if (!getCart.length) {
                const addedProduct = await cart.create({
                    data: req.body
                });

                return res
                    .status(201)
                    .send({ addedProduct, message: `Added ${addedProduct.id} to cart` });
            }

            const findProduct = getCart.find(
                (product) =>
                    product.user_id === user_id &&
                    product.product_id === product_id &&
                    product.size === size
            );

            if (!!findProduct) {
                const updateProduct = await cart.update({
                    where: { id: findProduct.id },
                    data: {
                        quantity: {
                            increment: quantity
                        }
                    }
                });

                return res.status(204).send({
                    updateProduct,
                    message: `Added ${quantity} more of ${updateProduct.product_id}`
                });
            }

            const addedProduct = await cart.create({
                data: req.body
            });

            res.status(201).send({ addedProduct, message: `Added ${addedProduct.id} to cart` });
        } catch (err) {
            console.log(err);
        }
    });

router
    .route('/wishlist')
    .get(async (req, res, next) => {})
    .post(async (req, res, next) => {
        console.log(req.body);
        const addToWishList = await 
        console.log('Post');
    })
    .delete(async (req, res, next) => {
        console.log(req.body);
        console.log('Delete');
    });

router.route('/products/:id').get(async (req, res, next) => {
    const { id } = req.params;

    const [name, tagname] = id.split('_');

    const data = await products.findFirst({
        where: { name, tagname },
        select: {
            name: true,
            tagname: true,
            price: true,
            cover: true,
            otherimages: true,
            gender: true,
            description: true,
            catagory: true,
            id: true
        }
    });

    if (!data) {
        return next(CustomError.alreadyExists('Product is not present'));
    }

    res.status(200).send({ data });
});

router.get('/trendy-cloth', async (req, res, next) => {
    let data = await products.findMany({
        where: {
            catagory: 'clothing'
        }
    });

    for (let i = 0; i < 5; i++) {
        for (let j = i; j < 5; j++) {
            const randomIndex = ~~Math.random(6);
            if (j === randomIndex + 1) {
                data = data.filter((_, id) => id !== j);
                break;
            }
        }
    }

    res.status(200).send({ data });
});

/*router
    .route('/orders')
    .get(async (req, res, next) => {
        try {

            const data = order

            const { rows } = await db.query(
                `SELECT 
                order_id, product_id, cover, name, tagname, 
                catagory, description, size, gender, quantity, price, 
                tags, orders.created_at, orders.updated_at FROM products
                JOIN orders ON orders.product_id = products._id ORDER BY orders.created_at`
            );
            return res.send({ data: rows });
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        const { _id } = req.body;
        try {
            const { rows } = await db.query(
                `
            SELECT cover, name, tagname, price
            FROM products 
            WHERE _id = $1 
            `,
                [_id]
            );
            if (rows.length) {
                const values = Object.values(req.body);

                const query = `
                INSERT INTO orders(
                    product_id,
                    size,
                    quantity
                ) VALUES(
                    ${values.map((_, id) => `$${id + 1}`)}
                )
                RETURNING *
            `;
                try {
                    const res = await db.query(query, values);

                    console.log(res);

                    return res.send({ message: 'OK' });
                } catch (error) {
                    next(error);
                }
            }
        } catch (error) {
            next(error);
        }
    });
    */

module.exports = router;
