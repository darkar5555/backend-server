var express = require('express');
var fs = require('fs');
var fileUpload = require('express-fileupload');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de colecciones
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no valida '}
        });
    }

    if( !req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            erros: { message: 'Debe de seleccionar una imagen' }
        });
    }

    //Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path en especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al enviar archivo',
                errors: err,
                nombreArchivo: nombreArchivo
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res);
    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Archivo movido',
    //     nombreCortado: extensionArchivo
    // });
});


function subirPorTipo(tipo, id, nombreArchivo, res){

    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario)=>{

            if (!usuario){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe'  }
                });
            }
            var pathViejo = './uploads/usuarios/'+ usuario.img;
            
            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;
            
            usuario.save( (err, usuarioActualizador)=>{

                usuarioActualizador.password = ':)'
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Image de usuario actualizada',
                    usuarioActualizador: usuarioActualizador
                });
            });
        });
    }

    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico)=>{

            if (!medico){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'  }
                });
            }
            var pathViejo = './uploads/medicos/'+ medico.img;
            
            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;
            
            medico.save( (err, medicoActualizado)=>{

                medicoActualizado.password = ':)'
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Image de medico actualizado',
                    medicoActualizado: medicoActualizado
                });
            });
        });   
    }

    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital)=>{

            if (!hospital){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe'  }
                });
            }
            var pathViejo = './uploads/usuarios/'+ hospital.img;
            
            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;
            
            hospital.save( (err, hospitalActualizado)=>{

                hospitalActualizado.password = ':)'
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Image de hospital actualizado',
                    hospitalActualizado: hospitalActualizado
                });
            });
        });      
    }
}


module.exports = app;

