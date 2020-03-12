//  ===============================================
//  Puerto
//  ===============================================
process.env.PORT = process.env.PORT || 3000;

//  ===============================================
//  Entorno
//  ===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//  ===============================================
//  vencimiento del token 
//  ===============================================
//  60 segundos
//  60 minutos
//  24 horas
//  30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//  ===============================================
//  SEED de autenticación
//  ===============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//  ===============================================
//  Google Client ID
//  ===============================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '441694253225-0v65k9feahs2r9uk2h9isppmog6f8n2t.apps.googleusercontent.com'