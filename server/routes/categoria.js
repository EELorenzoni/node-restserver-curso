const express = require('express');
const app = express();
const _ = require('underscore');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRol } = require('../middlewares/autentication');

// ==============================
// Mostrar todas las categorias
// ==============================
app.get('/categorias', verificaToken, (req, res) => {
    let since = req.query.since || 0;
    let quantity = req.query.quantity || 5;
    since = Number(since);
    quantity = Number(quantity);
    Categoria.find({}, 'descripcion estado usuario')
        .populate('usuario')
        .sort('descripcion')
        .skip(since)
        .limit(quantity)
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, count) => {
                res.json({
                    ok: true,
                    categoriaDB,
                    conteo: count
                })
            })
        })
});

// ==============================
// Mostrar una categoría
// ==============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    })

});

// ==============================
// crear una categoría, controlar token
// ==============================
app.post('/categoria', [verificaToken, verificaAdminRol], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==============================
// Actualiza una categoría
// ==============================
app.put('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'estado']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// ==============================
// Borra una categoría, solo un admin puede hacerlo
// ==============================

app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        console.log(categoriaDB);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(403).json({
                ok: false,
                categoria: `La categoría no existe`
            });

        }

        res.json({
            ok: true,
            categoria: `Se eliminó la categoría ${categoriaDB.descripcion} de la base de datos`
        });
    })
});


module.exports = app;