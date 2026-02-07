const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Serve static site (project root)
app.use(express.static(path.join(__dirname)));

// SQLite setup
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    total REAL,
    customer TEXT,
    createdAt TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT,
    product_id INTEGER,
    nome TEXT,
    preco REAL,
    quantidade INTEGER
  )`);
});

// products (static, served via API)
const produtos = [
  { id: 1, nome: "Café Mineiro Torrado e Moído, 500g", descricao: "Café Mineiro Torrado e Moído, 500g - Sabor encorpado e aroma intenso.", preco: 45.00, imagem: "fotos/cafe.png" },
  { id: 2, nome: "Café Mineiro Torrado e Moído, 1kg", descricao: "Café Mineiro Torrado e Moído, 1kg - Sabor encorpado e aroma intenso.", preco: 90.00, imagem: "fotos/cafe.png" },
  { id: 3, nome: "Café Mineiro Torrado (em grãos), 500g", descricao: "Café Mineiro Torrado em grãos, 500g - Sabor encorpado e aroma intenso.", preco: 45.00, imagem: "fotos/cafe.png" },
  { id: 4, nome: "Café Mineiro Torrado (em grãos), 1kg", descricao: "Café Mineiro Torrado em grãos, 1kg - Sabor encorpado e aroma intenso.", preco: 90.00, imagem: "fotos/cafe.png" },
  { id: 5, nome: "Café Descafeinado 500g", descricao: "Processo Swiss Water, mantendo todo o sabor sem a cafeína.", preco: 55.00, imagem: "fotos/cafe.png" },
  { id: 6, nome: "Kit Premium Zauli's", descricao: "Kit com 3 variedades especiais + caneca personalizada.", preco: 149.90, imagem: "fotos/cafe.png" }
];

// API: get products
app.get('/api/products', (req, res) => {
  res.json(produtos);
});

// API: checkout - persist to SQLite
app.post('/api/checkout', (req, res) => {
  const { cart, customer } = req.body || {};
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }
  const id = String(Date.now());
  const total = cart.reduce((s, it) => s + (it.preco * it.quantidade), 0);
  const createdAt = new Date().toISOString();

  db.serialize(() => {
    const insertOrder = db.prepare('INSERT INTO orders (id, total, customer, createdAt) VALUES (?, ?, ?, ?)');
    insertOrder.run(id, total, JSON.stringify(customer || {}), createdAt, function(err) {
      insertOrder.finalize();
      if (err) return res.status(500).json({ error: 'DB error' });
      const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, nome, preco, quantidade) VALUES (?, ?, ?, ?, ?)');
      cart.forEach(item => {
        insertItem.run(id, item.id, item.nome, item.preco, item.quantidade);
      });
      insertItem.finalize(() => {
        return res.json({ success: true, orderId: id });
      });
    });
  });
});

// API: get order (from DB)
app.get('/api/orders/:id', (req, res) => {
  const orderId = req.params.id;
  db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'Not found' });
    db.all('SELECT * FROM order_items WHERE order_id = ?', [orderId], (err2, items) => {
      if (err2) return res.status(500).json({ error: 'DB error' });
      const order = { id: row.id, total: row.total, customer: JSON.parse(row.customer || '{}'), createdAt: row.createdAt, items };
      res.json(order);
    });
  });
});

// Payment: generate QR code for amount or order
const QRCode = require('qrcode');
app.post('/api/payment/qr', async (req, res) => {
  try {
    const { orderId, amount } = req.body || {};
    let value = amount;
    if (orderId && !value) {
      const row = await new Promise((resolve, reject) => db.get('SELECT total FROM orders WHERE id = ?', [orderId], (err, r) => err ? reject(err) : resolve(r)));
      if (!row) return res.status(404).json({ error: 'Order not found' });
      value = row.total;
    }
    if (!value) return res.status(400).json({ error: 'Amount not provided' });
    // Payload can be customized to your payment provider; here we create a simple payment payload
    const payload = JSON.stringify({ provider: 'custom', orderId: orderId || null, amount: Number(value) });
    const dataUrl = await QRCode.toDataURL(payload);
    res.json({ success: true, qr: dataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'QR generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Zauli's demo server running on http://localhost:${PORT}`);
});
