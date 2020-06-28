const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.put('/upload/:tipo/:id', function(req, res) {
    // TODO castear bien el id
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // validar tipo
    let tipoValidos = ['productos', 'usuarios'];

    if (tipoValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tipoValidos}`,
            }
        })
    }


    let file = req.files.file;

    const splittedName = file.name.split('.');
    const extension = splittedName[splittedName.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesValidas}`,
                ext: extension
            }
        })
    }

    let savedFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${tipo}/${savedFileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case tipoValidos[0]:
                imagenProducto(id, res, savedFileName);
                break;
            case tipoValidos[1]:
                imagenUsuario(id, res, savedFileName);
                break;
            default:
                break;
        }
    });

});

function imagenUsuario(id, res, savedFileName) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            cleanFile(savedFileName, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'el usuario no existe'
            });
        }
        cleanFile(usuarioDB.img, 'usuarios');

        usuarioDB.img = savedFileName;

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: savedFileName
            })
        })

    });

};

function imagenProducto(id, res, savedFileName) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            cleanFile(savedFileName, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'el producto no existe'
            });
        }
        cleanFile(productoDB.img, 'productos');

        productoDB.img = savedFileName;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: savedFileName
            })
        })

    });

};



function cleanFile(fileName, tipo) {
    // console.log('a verrrrr', fileName, tipo);
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${fileName}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
};

module.exports = app;