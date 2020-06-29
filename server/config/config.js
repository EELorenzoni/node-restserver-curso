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
process.env.CADUCIDAD_TOKEN = `48h`;
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

process.env.CLIENT_ID = process.env.CLIENT_ID || '441694253225-q5tcstg9e2l3410cb73f28tksonlq1mm.apps.googleusercontent.com'