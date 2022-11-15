const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const sequelize = require('./utils/database');
const dataRoute = require('./routes/routes');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json({extended: false}));

app.use(dataRoute);

sequelize
// .sync({force:true})
.sync()
.then(result=>{
    console.log(result);
    app.listen(4000);

})
.catch(err=>{
    console.log(err);
})