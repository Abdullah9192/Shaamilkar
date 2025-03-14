const express = require("express");
const Product = express.Router();
const route = require("../../Controllers/Product/index");

Product.get('/product/:id' , route.getsingleProduct);

module.exports = Product;
