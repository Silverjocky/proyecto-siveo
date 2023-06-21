const express = require('express')
const proovedoresControllerApi = require('../controllers/proovedores-controller-api')
const router = express.Router();

//La Ruta (End Point) GET de todas las categorias 
router.get('/',proovedoresControllerApi.getTodasProovedores);

//La Ruta (End Point) GET de solo una categoria 
router.get('/:id',proovedoresControllerApi.getProovedorById);

//La Ruta (End point) AGREGAR = POST de una categoria
router.post('/',proovedoresControllerApi.agregarProovedor);

//La Ruta (End point) UPDATE = PUT de una categoria
router.put('/:id',proovedoresControllerApi.updateProovedor);

//La Ruta (End point) DELETE de una categoria
router.delete('/:id',proovedoresControllerApi.deleteProovedorById);

//Para poder usar el router en otro archivo .js o modulo
module.exports = router;