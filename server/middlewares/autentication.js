const jwt = require('jsonwebtoken');

//  ===============================================
//  Verifica Token
//  ===============================================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};
//  ===============================================
//  Verifica Rol
//  ===============================================

let verificaAdminRol = (req, res, next) => {

    usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: 'debe de ser un administrador para ejecutar esta acción'
        });
    }

    next();

};


module.exports = {
    verificaToken,
    verificaAdminRol
}