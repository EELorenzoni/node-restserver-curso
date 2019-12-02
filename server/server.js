require('./config/config');
const express = require('express');
const app = express();

// body-parser
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// end body-parser
app.get('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({ id: id })
    res.json('Hello get');
});
app.post('/usuario', (req, res) => {
    let body = req.body;
    res.json({ body });
});
app.put('/usuario', (req, res) => {
    res.json('Hello put');
});
app.delete('/usuario', (req, res) => {
    res.json('Hello delete');
});


app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
});