require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// body-parser
const bodyParser = require('body-parser');
// path quenerico
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('base datos online');
});
app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`);
});