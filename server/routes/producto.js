const express = require('express');
const { verificaToken, verificaAdminRol } = require('../middlewares/autentication');
const _ = require('underscore');
let app = express();
let Producto = require('../models/producto');


// ==============================
// Mostrar todos los productos
// ==============================

app.get('/productos', verificaToken, (req, res) => {
    // traer todos los productos
    // populate usuario categoria
    // paginado

    let since = req.query.since || 0;
    let quantity = req.query.quantity || 5;
    since = Number(since);
    quantity = Number(quantity);
    Producto.find({})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('nombre')
        .skip(since)
        .limit(quantity)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count((err, count) => {
                res.json({
                    ok: true,
                    productoDB,
                    conteo: count
                })
            })
        })
});

// ==============================
// Buscar producto
// ==============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    // populate usuario categoria
    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        })

});

// ==============================
// Obtener Producto por id
// ==============================

app.get('/producto/:id', (req, res) => {
    // populate usuario categoria

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        })

});


// ==============================
// Crear un producto
// ==============================

app.post('/producto', [verificaToken, verificaAdminRol], (req, res) => {
    // grabar el usuario que lo creo
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.idCategoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    })
});



// ==============================
// Actualizar un producto
// ==============================

// actualizar un producto y grabar el usuario
// paginado
app.put('/producto/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'disponible', 'precioUni', 'idCategoria']);
    body = {...body, usuario: req.usuario._id };
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// ==============================
// Borra el producto
// ==============================

app.delete('/producto/:id', (req, res) => {
    // borrar el producto logicamente
    // grabar el usuario
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'el producto no existe'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

module.exports = app;