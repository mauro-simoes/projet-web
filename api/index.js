const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors')
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const orderRoute = require("./routes/order.route.js");
const userRoute = require("./routes/user.route.js");
const authRoutes = require("./routes/auth.route.js");

const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:false}));

app.use(cors())

app.use("/produit", productRoute);
app.use("/commandes", orderRoute);
app.use('/user', userRoute);
app.use('/authentification', authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });