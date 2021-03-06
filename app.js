//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());


//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes =  require('./routes/hospital');
var medicoRoutes =  require('./routes/medico');
var busquedaRoutes =  require('./routes/busqueda');
var uploadRoutes =  require('./routes/upload');
var imagenesRoutes =  require('./routes/imagenes');

//conexion a la bese de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if (err) throw err;
    console.log('Base de datos: \x1b[31m\x1b[0m', 'online');
})


//rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);


app.use('/', appRoutes);



//Escuchar peticiones
app.listen(3000, ()=>{
    console.log('express server corriendo en el puerto 3000: \x1b[31m\x1b[0m', 'online');
});