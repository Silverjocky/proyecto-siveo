let idActualizarProducto = 0;
let idEliminarProducto = 0;

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

function agregarProducto() {
  
  const descripcion = document.getElementById('idDescripcionProductos').value;
  const precio = document.getElementById('precioProductoAgregar').value;
  let URL = getURL() + '/productos/api';
  $.ajax({
    method: 'POST',//Método
    url: URL,//End Point
    data: {//Body
      descripcion: descripcion,
      precio: precio
    },
    success: function( result ) {
      
      if (result.estado==1) {
        //Agregar la categoria a la tabla
        const producto = result.producto;
        let tabla = $('#tabla-productos').DataTable();
        let botones = generaBotones(producto);
        let nuevoRenglon =tabla.row.add([producto.descripcion,producto.precio,botones]).node();
        $(nuevoRenglon).find('td').addClass('table-td');
        tabla.draw(false);
        
        //Limpiar campos
        document.getElementById('descripcionProductoAgregar').value='';
        document.getElementById('precioProductoAgregar').value='';
        
        Swal.fire({
          
          position: 'top-end',
          icon: 'success',
          title: 'Producto guardada',
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
function listaProductoFront(){
  
    //Usamos la libreria jquery para JS
    let URL = getURL()+'/productos/api';
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
                
                let productos = result.productos;
                
                let tabla = $('#tabla-productos').DataTable();
                
              
                productos.forEach(producto => {
                 
                    let Botones = generaBotones(producto);
                    let nuevoRenglon = tabla.row.add([producto.descripcion,producto.precio,Botones]).node();
                    //Linea agregada
                    $(nuevoRenglon).attr('id','renglon_'+producto.id);
                    $(nuevoRenglon).find('td').addClass('table-td');
                    tabla.draw( false );
                    
                }); 
            }else{
                alert(mensaje);
            }
        }
      });
}
function eliminarProductoById() {

  $.ajax({
    method: 'DELETE',
    url: getURL() + '/productos/api/' + idEliminarProducto,
    data: {},
    success: function( result ) {
      if(result.estado == 1){
        //1.- Si se eliminó de DB
        //2.- Debemos de eliminarlo de la tabla-----------------------------
        let tabla = $('#tabla-productos').DataTable();
        tabla.row('#renglon_'+idEliminarProducto).remove().draw();
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto eliminada',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        //Mostrar mensaje que no se eliminó-----
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Producto NO eliminada',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  });
}

function actualizarProductoById() {

  let descripcionProducto = document.getElementById('descripcionProductoActualizar').value;
  let precioProducto = document.getElementById('precioProductoActualizar').value;
 
  $.ajax({
    method: 'PUT',
    url: getURL() + '/productos/api/' + idActualizarProducto,
    data: {
      "descripcion": descripcionProducto,
      "precio": precioProducto
    },
    success: function(result) {
      
      if(result.estado == 1){
        //alert(result.mensaje);
        //1.- Si se actualizó de DB
        //2.- Debemos de actualizar la tabla-----------------------------
        let tabla = $('#tabla-productos').DataTable();
        let renglonTemporal = tabla.row('#renglon_'+idActualizarProducto).data();
        renglonTemporal[0] = descripcionProducto;
        renglonTemporal[1] = precioProducto;
        tabla
             .row('#renglon_'+idActualizarProducto)
             .data(renglonTemporal)
             .draw();
             
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto actualizado',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        alert(result.mensaje);
      }
    }
  });
}

function generaBotones(producto) {
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

  Botones += '<a href="#" onclick="identificaIdActualizar('+producto.id+');" class="btn btn-primary shadow btn-xs sharp me-1"';
  Botones +=  'data-bs-toggle="modal" data-bs-target="#exampleModalCenter2"><i>';
  Botones +=      ' <class="fas fa-pencil-alt"></i></a>';

  Botones +=  '<a href="#" onclick="identificaIdEliminar('+producto.id+');" class="btn btn-danger shadow btn-xs sharp"';
  Botones +=   'data-bs-toggle="modal" data-bs-target="#exampleModalCenter3"><i>';
  Botones += ' <class="fa fa-trash"></i></a>';
  Botones += '</div>';
  return Botones;
}

function identificaIdEliminar(id) {
  idEliminarProducto = id;
}
function identificaIdActualizar(id){
  
  idActualizarProducto = id;
  //Necesitamos conectar con la base de datos para obtener los datos y mostrarlos
  //Esto lo hacemos con jquery
  $.ajax({
    method: 'GET',
    url: getURL() + '/productos/api/' + idActualizarProducto,
    data: {},
    success: function( result ) {
      if (result.estado == 1) {
        
        let productos = result.producto;
        document.getElementById('descripcionProductoActualizar').value = productos.descripcion;
        document.getElementById('precioProductoActualizar').value = productos.precio;
        //alert(categoria.descripcion);
      }else{
        alert(result.mensaje);
      }
    }
  });
}

listaProductoFront();