let idActualizarProovedor = 0;
let idEliminarProovedor = 0;

function getURL(){
  let URL = window.location.protocol + '//'+window.location.hostname;
  if(window.location.port){
    URL += ':'+window.location.port;
  }
  return URL;
}

/*function muestraUnaCategoria(id){
  let URL = getURL() + '/categorias/api/' + id;//params
  //alert(URL);
  $.ajax({
    method:'GET',
    url: URL,
    data: {},//Body
    success: function( result ) {
      if (result.estado == 1) {
        //Debemos mostrar la categoria en la ventana
        const categoria = result.categoria;
        //Inputs de la vetana modal
        document.getElementById('descripcionCategoriaVisualizar').value=categoria.descripcion;
        document.getElementById('precioCategoriaVisualizar').value=categoria.precio;
      }else{
        //Mostrar el mensaje de error
        alert(result.mensaje);
      }
    }
  });
}*/

function agregarProovedor() {
  const nombre = document.getElementById('nombreProovedorAgregar').value;
  const direccion = document.getElementById('direccionProovedorAgregar').value;
  const telefono = document.getElementById('telefonoProovedorAgregar').value;
  let URL = getURL() + '/proovedores/api/';
  $.ajax({
    method: 'POST',//Método
    url: URL,//End Point
    data: {//Body
      nombre: nombre,
      direccion: direccion,
      telefono: telefono
    },
    success: function( result ) {
      if (result.estado==1) {
        //Agregar la categoria a la tabla
        const proovedor = result.proovedor;
        let tabla = $('#tabla-proovedores').DataTable();
        let botones = generaBotones(proovedor);
        let nuevoRenglon =tabla.row.add([proovedor.id,proovedor.nombre,proovedor.direccion,proovedor.telefono,botones]).node();
        $(nuevoRenglon).find('td').addClass('table-td');
        tabla.draw(false);
        //Limpiar campos
        document.getElementById('nombreProovedorAgregar').value='';
        document.getElementById('direccionProovedorAgregar').value='';
        document.getElementById('telefonoProovedorAgregar').value='';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Proovedor guardado',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        alert(result.mensaje);
      }
    }
  });
}
//Funciones para comunicarnos con el back API - End Point
function listaProovedorFront(){
  
    //Usamos la libreria jquery para JS
    let URL = getURL()+'/proovedores/api/';
    $.ajax({
        //Verbo (get,put,delete,post)
        method: 'GET',
        url: URL,
        data: {},
        success: function( result ) {
          
            let estado = result.estado;
            let mensaje = result.mensaje;
            
            if (estado == 1) {
                //Mostramos las categorias
                
                let proovedores = result.proovedores;
                
                let tabla = $('#tabla-proovedores').DataTable();
              
                proovedores.forEach(proovedor => {
                 
                    let Botones = generaBotones(proovedor);
                    let nuevoRenglon = tabla.row.add([proovedor.id,proovedor.nombre,proovedor.direccion,proovedor.telefono,Botones]).node();
                    //Linea agregada
                    $(nuevoRenglon).attr('id','renglon_'+proovedor.id);
                    $(nuevoRenglon).find('td').addClass('table-td');
                    tabla.draw( false );
                    
                }); 
            }else{
                alert(mensaje);
            }
        }
      });
}
function eliminarProovedorById() {

  $.ajax({
    method: 'DELETE',
    url: getURL() + '/proovedores/api/' + idEliminarProovedor,
    data: {},
    success: function( result ) {
      if(result.estado == 1){
        //1.- Si se eliminó de DB
        //2.- Debemos de eliminarlo de la tabla-----------------------------
        let tabla = $('#tabla-proovedores').DataTable();
        tabla.row('#renglon_'+idEliminarProovedor).remove().draw();
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Proovedor eliminado',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        //Mostrar mensaje que no se eliminó-----
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Proovedor NO eliminada',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  });
}

function actualizarProovedorById() {

  let nombreProovedor = document.getElementById('nombreProovedorActualizar').value;
  let direccionProovedor = document.getElementById('direccionProovedorActualizar').value;
  let telefonoProovedor = document.getElementById('telefonoProovedorActualizar').value;
 
  $.ajax({
    method: 'PUT',
    url: getURL() + '/proovedores/api/' + idActualizarProovedor,
    data: {
      "nombre": nombreProovedor,
      "direccion": direccionProovedor,
      "telefono": telefonoProovedor
    },
    success: function(result) {
      
      if(result.estado == 1){
        //alert(result.mensaje);
        //1.- Si se actualizó de DB
        //2.- Debemos de actualizar la tabla-----------------------------
        let tabla = $('#tabla-proovedores').DataTable();
        let renglonTemporal = tabla.row('#renglon_'+idActualizarProovedor).data();
        renglonTemporal[1] = nombreProovedor;
        renglonTemporal[2] = direccionProovedor;
        renglonTemporal[3] = telefonoProovedor;
        tabla
             .row('#renglon_'+idActualizarProovedor)
             .data(renglonTemporal)
             .draw();
             
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Proovedor actualizado',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        alert(result.mensaje);
      }
    }
  });
}

function generaBotones(proovedor) {
  /*let Botones = '<div class="flex space-x-3 rtl:space-x-reverse">';
                  Botones += '<button onclick="muestraUnaCategoria('+categoria.id+');" data-bs-toggle="modal" data-bs-target="#viewModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:eye"></iconify-icon>'
                  Botones += '</button>'

                  Botones += '<button onclick="identificaIdActualizar('+categoria.id+');" data-bs-toggle="modal" data-bs-target="#updateModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:pencil-square"></iconify-icon>'
                  Botones += '</button>'

                  Botones += '<button onclick="identificaIdEliminar('+categoria.id+');" data-bs-toggle="modal" data-bs-target="#deleteModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:trash"></iconify-icon>'
                  Botones += '</button>'
                  Botones += '</div>';*/


  let Botones =  '<div class="d-flex">';

  Botones += '<a href="#" onclick="identificaIdActualizar('+proovedor.id+');" class="btn btn-primary shadow btn-xs sharp me-1"';
  Botones +=  'data-bs-toggle="modal" data-bs-target="#exampleModalCenter2"><i>';
  Botones +=      ' <class="fas fa-pencil-alt"></i></a>';

  Botones +=  '<a href="#" onclick="identificaIdEliminar('+proovedor.id+');" class="btn btn-danger shadow btn-xs sharp"';
  Botones +=   'data-bs-toggle="modal" data-bs-target="#exampleModalCenter3"><i>';
  Botones += ' <class="fa fa-trash"></i></a>';
  Botones += '</div>';
  return Botones;
}

function identificaIdEliminar(id) {
  idEliminarProovedor = id;
}
function identificaIdActualizar(id){
  alert("XD");
  idActualizarProovedor = id;
  //Necesitamos conectar con la base de datos para obtener los datos y mostrarlos
  //Esto lo hacemos con jquery
  $.ajax({
    method: 'GET',
    url: getURL() + '/proovedores/api/' + idActualizarProovedor,
    data: {},
    success: function( result ) {
      if (result.estado == 1) {
        
        let proovedores = result.proovedor;
        document.getElementById('nombreProovedorActualizar').value = proovedores.nombre;
        document.getElementById('direccionProovedorActualizar').value = proovedores.direccion;
        document.getElementById('telefonoProovedorActualizar').value = proovedores.telefono;
        //alert(categoria.descripcion);
      }else{
        alert(result.mensaje);
      }
    }
  });
}

listaProovedorFront();