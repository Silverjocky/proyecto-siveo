const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const port = process.env.PORT || 3000;

const rutasCategoriasAPI = require('./src/routes/categorias-routes-api');
const rutasProductosAPI = require('./src/routes/productos-routes-api');
const rutasProovedoresAPI = require('./src/routes/proovedores-routes-api');

const app = express();

app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials',()=>{});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());
//Paginas en uso
app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/login',(req,res)=>{
    res.render('page-login');
});



app.use('/categorias/api/',rutasCategoriasAPI);

app.use('/productos/api/',rutasProductosAPI);

app.use('/proovedores/api/',rutasProovedoresAPI);


app.get('/categorias',(req,res)=>{
    res.render('table-datatable-basic-cat')
});

app.get('/productos',(req,res)=>{
    res.render('table-datatable-basic-pro')
});

app.get('/proveedores',(req,res)=>{
    res.render('table-datatable-basic-prove')
});

app.get('*',(req,res)=>{
    res.render('page-error-404');
});
app.listen(port,()=>{
    console.log('El servidor corriendo en el puerto: ',port);
});