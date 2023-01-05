const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');


const dotenv = require('dotenv')


const sequelize = require('./utils/database');
const dataRoute = require('./routes/routes');
const purchaseRoute = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premium");


const cors = require('cors');
const User = require('./models/users');
const Expense = require('./models/models');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgot');
const forgotRoute = require("./routes/forgot");

const app = express();

app.use(cors());
dotenv.config();

app.use(bodyParser.json({extended: false}));

app.use(dataRoute);
app.use("/purchase",purchaseRoute);

app.use('/premium', premiumFeatureRoutes);
app.use('/password', forgotRoute);
app.use('/user', dataRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

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