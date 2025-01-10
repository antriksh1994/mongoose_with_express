const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const mothedOverride = require("method-override");

// app.use(req, res) runs on every request
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(mothedOverride("_method"));

mongoose
  .connect("mongodb://127.0.0.1:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch((err) => {
    console.log("===err===", err);
  });

app.get("/products/new", async (req, res) => {
  // const products = await Product.find({});
  // res.send('CREATE PRODUCT')
  res.render("products/new");
});
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  }
  const products = await Product.find({});
    // res.send('ALL PRODUCTS WILL BE HERE')
    res.render("products/index", { products, category: 'ALL' });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findById(id)
    .then((product) => {
      console.log("product", product);
      res.render("products/details", { product });
    })
    .catch((err) => {
      console.log(err);
    });
  // only 1 can be used like res.send or res.render
  // res.send('ALL PRODUCTS WILL BE HERE')
  //   res.send("Details Page!!");
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  await Product.findById(id)
    .then((product) => {
      console.log("product", product);
      res.render("products/edit", { product });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/products/", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(req.body);
  res.redirect(`/products/${newProduct._id}`);
});
// delete and put requests cannot be made from HTML form so we use override
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id, req.body, {
    runValidators: true,
    new: true,
  });
  // res.send('PUTT!!')
  res.redirect("/products");
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  // res.send('PUTT!!')
  res.redirect(`/products/${product._id}`);
});
app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000!");
});
