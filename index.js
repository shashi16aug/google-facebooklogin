const express= require( "express");
const app = express();
const cookieParser =require("cookie-parser");
app.use(cookieParser());
const path = require('path');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var indexRouter = require('./routes/index');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

const swaggerOptions={
    swaggerDefinition:{
        info:{
            title:"Google Login API",
            description:"login with google",
            contact:{
                name:"Shashi Ranjan"
            },
            servers:['http://localhost:3000']
        }
    },
    // apis:["index.js"]
       apis:['./routes/index.js'] 
}
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));


app.use('/', indexRouter);

  
app.listen(port, () => {
    console.log(`App listening http://localhost:${port}`);
  });