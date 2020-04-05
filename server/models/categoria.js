const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let validState = {
    values: ['ACTIVO', 'INACTIVO'],
    message: '{VALUE} no es un estado válido'
}
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'El descripcion es obligatoria'],
        unique: true
    },
    estado: {
        type: String,
        default: 'ACTIVO',
        enum: validState
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);