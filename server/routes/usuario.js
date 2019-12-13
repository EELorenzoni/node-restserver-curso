const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuarios', (req, res) => {
    let since = req.query.since || 0;
    let quantity = req.query.quantity || 5;
    console.log('hola prod ' + req);
    since = Number(since);
    quantity = Number(quantity);
    Usuario.find({ estado: true }, 'nombre email role estado google')
        .skip(since)
        .limit(quantity)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo: count
                })
            })
        })
});

app.post('/usuario', (req, res) => {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });

    });
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    })

});
app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBD
            });
        })
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //     if (err) {
        //         return res.status(400).json({
        //             ok: false,
        //             err
        //         });
        //     };
        //     if (!usuarioBorrado) {
        //         return res.status(400).json({
        //             ok: false,
        //             err: {
        //                 message: 'Usuario no encontrado'
        //             }
        //         });
        //     }
        //     res.json({
        //         ok: true,
        //         usuario: usuarioBorrado
        //     });
        // })
});


module.exports = app;