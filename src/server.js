const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const conn = mysql.createConnection({
    host: "localhost",
    user: "root", 
    database: "game_item_store",
    password: "" 
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'assets', 'image', 'game'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

conn.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.post('/api/liqpay', (req, res) => {
    const { amount, currency, description, order_id } = req.body;

    const public_key = "sandbox_i36321561480";
    const private_key = "sandbox_mV2xLB20t04oimwbRDQ7w2Vti9nO3BWjVgmolB6N";
    
    const liqpayData = {
        public_key,
        version: '3',
        action: 'pay',
        amount,
        currency,
        description,
        order_id,
        result_url: 'http://localhost:8080/user-account',
        server_url: 'http://localhost:3000/api/liqpay-callback',
    };

    const data = Buffer.from(JSON.stringify(liqpayData)).toString('base64');
    const signature = crypto.createHash('sha1').update(private_key + data + private_key).digest('base64');

    res.json({ data, signature });
});

app.post('/api/liqpay-callback', (req, res) => {
    console.log('LiqPay Callback:', req.body);
    res.sendStatus(200);
});

app.get('/comments/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM comments WHERE parent_id = ?';
    conn.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).send('Error fetching comments');
        } else {
            res.json(results);
        }
    });
});

app.post('/add_comment', (req, res) => {
    const { body, user_id, parent_id } = req.body;

    const sql = 'INSERT INTO comments (body, user_id, parent_id) VALUES (?, ?, ?)';
    conn.query(sql, [body, user_id, parent_id], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            res.status(500).send('Error adding comment');
        } else {
            console.log('Comment added successfully:', result);
            res.send('Comment added successfully');
        }
    });
});

app.get('/products_card', (req, res) => {
    conn.query('SELECT id, game_id, name, description, body, photo, price, enable, created_at, updated_at FROM products', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving food');
        } else {
            res.json(results);
        }
    });
});
app.get('/products', (req, res) => {
    conn.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving foods');
        } else {
            res.json(results);
        }
    });
});
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    conn.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving products');
        } else {
            res.json(results);
        }
    });
});

app.post('/add_product', upload.single('photo'), (req, res) => {
    const { game_id, name, description, body, price, enable } = req.body;
    const photo = req.file ? req.file.filename : ''; 

    const sql = 'INSERT INTO products (game_id, name, description, body, photo, price, enable) VALUES (?, ?, ?, ?, ?, ?, ?)';
    conn.query(sql, [game_id, name, description, body, photo, price, enable], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            res.status(500).send('Error adding product');
        } else {
            console.log('Product added successfully:', result);
            res.send('Product added successfully');
        }
    });
});

app.put('/edit_product/:id', upload.single('photo'), (req, res) => {
    const productId = req.params.id;
    const { game_id, name, description, body, price, enable } = req.body;
    const photo = req.file ? req.file.filename : '';

    const sql = 'UPDATE products SET game_id = ?, name = ?, description = ?, body = ?, photo = ?, price = ?, enable = ? WHERE id = ?';
    conn.query(sql, [game_id, name, description, body, photo, price, enable, productId], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).send('Error updating product');
        } else {
            console.log('Product updated successfully:', result);
            res.send('Product updated successfully');
        }
    });
});

app.delete('/delete_product/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'DELETE FROM products WHERE id = ?';
    conn.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting food:', err);
            res.status(500).send('Error deleting food');
        } else {
            console.log('Food deleted successfully:', result);
            res.send('Food deleted successfully');
        }
    });
});

app.get('/orders', (req, res) => {
    conn.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).send('Error fetching orders');
        } else {
            res.json(results);
        }
    });
});

app.put('/update_order_status/:id', (req, res) => {
    const orderId = req.params.id;
    const { order_status } = req.body;
    console.log(order_status);
    console.log(orderId);
    
    conn.query('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, orderId], (err, result) => {
      if (err) {
        console.error('Error updating order status:', err);
        res.status(500).send('Error updating order status');
      } else {
        console.log('Order status updated successfully:', result);
        res.send('Order status updated successfully');
      }
    });
  });
  
app.get('/categories', (req, res) => {
    conn.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving categories');
        } else {
            res.json(results);
        }
    });
});
app.post('/add_category', (req, res) => {
    const { name, description, fields } = req.body;

    conn.query('INSERT INTO categories (name, description, fields) VALUES (?,?,?)', [name, description, fields], (err, result) => {
        if (err) {
            console.error('Error adding category:', err);
            res.status(500).send('Error adding category');
        } else {
            console.log('Category added successfully:', result);
            res.send('Category added successfully');
        }
    });
});
app.delete('/delete_category/:id', (req, res) => {
    const categoryId = req.params.id;

    conn.query('DELETE FROM categories WHERE id = ?', [categoryId], (err, result) => {
        if (err) {
            console.error('Error deleting category:', err);
            res.status(500).send('Error deleting category');
        } else {
            console.log('Category deleted successfully:', result);
            res.send('Category deleted successfully');
        }
    });
});
app.put('/edit_category/:id', (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    conn.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], (err, result) => {
        if (err) {
            console.error('Error updating category:', err);
            res.status(500).send('Error updating category');
        } else {
            console.log('Category updated successfully:', result);
            res.send('Category updated successfully');
        }
    });
});

app.get('/users', (req, res) => {
    conn.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results);
        }
    });
});

app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    conn.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error retrieving user data:', err);
            res.status(500).send('Error retrieving user data');
        } else {
            if (rows.length === 0) {
                res.status(404).send('User not found');
            } else {
                const userData = rows[0];
                res.json(userData);
            }
        }
    });
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    conn.query('SELECT * FROM users WHERE login = ? OR email = ?', [username, email], (err, rows) => {
        if (err) {
            console.error('Error checking existing user:', err);
            res.status(500).send('Error checking existing user');
        } else {
            if (rows.length > 0) {
                res.status(400).send('Користувач з таким іменем або електронною поштою вже існує');
            } else {
                const sql = 'INSERT INTO users (login, email, password) VALUES (?, ?, ?)';
                conn.query(sql, [username, email, password], (err, result) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        res.status(500).send('Error registering user');
                    } else {
                        console.log('User registered successfully:', result);
                        res.send('User registered successfully');
                    }
                });
            }
        }
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    conn.query('SELECT * FROM users WHERE login = ?', [username], (err, rows) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).send('Error checking user');
        } else {
            if (rows.length === 0) {
                res.status(400).send({ error: 'user_not_found' });
            } else {
                const user = rows[0];
                if (user.password !== password) {
                    res.status(400).send({ error: 'incorrect_password' });
                } else {
                    res.send({ id: user.id, message: 'login_successful' });
                }
            }
        }
    });
});
app.put('/update_user/:id', (req, res) => {
    const { login, password, user_photo_path } = req.body;
    const { id } = req.params;
    conn.query('UPDATE users SET login = ?, password = ?, photo = ? WHERE id = ?', [login, password, user_photo_path, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        } else {
            console.log('User updated successfully:', result);
            res.send('User updated successfully');
        }
    });
});

app.post('/add_to_cart', (req, res) => {
    const { user_id, product_id, price, quantity, image_path, product_name, product_user_info } = req.body;
    const sql = 'INSERT INTO product_cart (user_id, product_id, price, quantity, image_path, product_name, product_user_info) VALUES (?, ?, ?, ?, ?, ?, ?)';
    conn.query(sql, [user_id, product_id, price, quantity, image_path, product_name, product_user_info], (err, result) => {
        if (err) {
            console.error('Error adding to cart:', err);
            res.status(500).send('Error adding to cart');
        } else {
            console.log('Added to cart successfully:', result);
            res.send('Added to cart successfully');
        }
    });
});


app.get('/user_cart/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT * FROM product_cart WHERE user_id = ?';
    conn.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error retrieving user cart:', err);
            res.status(500).send('Error retrieving user cart');
        } else {
            res.json(results);
        }
    });
});
app.get('/user_orders/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = 'SELECT * FROM orders WHERE user_id = ?';
    conn.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error retrieving user orders:', err);
            res.status(500).send('Error retrieving user orders');
        } else {
            res.json(results);
        }
    });
});

app.delete('/remove_from_cart/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM product_cart WHERE id = ?';
    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error removing from cart:', err);
            res.status(500).send('Error removing from cart');
        } else {
            console.log('Removed from cart successfully:', result);
            res.send('Removed from cart successfully');
        }
    });
});
app.delete('/remove_all_cart/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = 'DELETE FROM product_cart WHERE user_id = ?';
    conn.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Error removing from cart:', err);
            res.status(500).send('Error removing from cart');
        } else {
            console.log('Removed from cart successfully:', result);
            res.send('Removed from cart successfully');
        }
    });
});
app.post('/place_order', (req, res) => {
    const { user_id, products_price, order_status, products_name, order_descr } = req.body;
    const sql = 'INSERT INTO orders (user_id, products_price, order_status, products_name, order_descr) VALUES (?, ?, ?, ?, ?)';
    conn.query(sql, [user_id, products_price, order_status, products_name, order_descr], (err, result) => {
        if (err) {
            console.error('Error placing order:', err);
            res.status(500).send('Error placing order');
        } else {
            console.log('Order placed successfully:', result);
            res.send('Order placed successfully');
        }
    });
});
app.get('/product_info', (req, res) => {
    const sql = 'SELECT * FROM product_info';
    conn.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving product info:', err);
            res.status(500).send('Error retrieving product info');
        } else {
            res.json(results);
        }
    });
});

app.post('/add_product_info', (req, res) => {
    const { product_id, credentials } = req.body;

    const sql = 'INSERT INTO product_info (id, product_id, credentials) VALUES (UUID(), ?, ?)';
    conn.query(sql, [product_id, credentials], (err, result) => {
        if (err) {
            console.error('Error adding product info:', err);
            res.status(500).send('Error adding product info');
        } else {
            console.log('Product info added successfully:', result);
            res.send('Product info added successfully');
        }
    });
});

app.get('/get_product_credentials/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM product_info WHERE product_id = ? LIMIT 1';
    conn.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product credentials:', err);
            res.status(500).send('Error fetching product credentials');
        } else {
            res.json(results[0]); 
        }
    });
});

app.delete('/delete_product_credentials/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'DELETE FROM product_info WHERE product_id = ? LIMIT 1';
    conn.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product credentials:', err);
            res.status(500).send('Error deleting product credentials');
        } else {
            console.log('Product credentials deleted successfully:', result);
            res.send('Product credentials deleted successfully');
        }
    });
});

app.delete('/delete_product_info/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM product_info WHERE id = ?';
    conn.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product info:', err);
            res.status(500).send('Error deleting product info');
        } else {
            console.log('Product info deleted successfully:', result);
            res.send('Product info deleted successfully');
        }
    });
});

app.put('/edit_product_info/:id', (req, res) => {
    const { id } = req.params;
    const { product_id, credentials } = req.body;

    const sql = 'UPDATE product_info SET product_id = ?, credentials = ? WHERE id = ?';
    conn.query(sql, [product_id, credentials, id], (err, result) => {
        if (err) {
            console.error('Error updating product info:', err);
            res.status(500).send('Error updating product info');
        } else {
            console.log('Product info updated successfully:', result);
            res.send('Product info updated successfully');
        }
    });
});
app.get('/check_product_availability/:productId', (req, res) => {
    const productId = req.params.productId;
    const checkSql = 'SELECT * FROM product_info WHERE product_id = ?';
    conn.query(checkSql, [productId], (err, results) => {
        if (err) {
            console.error('Error checking product availability:', err);
            res.status(500).send('Error checking product availability');
        } else if (results.length === 0) {
            const updateSql = 'UPDATE products SET enable = 0 WHERE id = ?';
            conn.query(updateSql, [productId], (err, result) => {
                if (err) {
                    console.error('Error updating product status:', err);
                    res.status(500).send('Error updating product status');
                } else {
                    res.json({ available: false });
                }
            });
        } else {
            res.json({ available: true });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
