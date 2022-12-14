var express = require("express");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelpers.getAllProducts().then((product) => {
    console.log(product);
    res.render("admin/view-products", { admin: true, product });
  });
});

router.get("/add-products", function (req, res) {
  res.render("admin/add-products", { admin: true });
});
router.post("/add-products", (req, res) => {
  productHelpers.addproducts(req.body, (id) => {
    let image = req.files.image;
    console.log(id);
    image.mv("./public/product-images/" + id + ".jpg", (err) => {
      if (!err) {
        res.render("admin/add-products", { admin: true });
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/delete-product/:id", (req, res) => {
  let proId = req.params.id;
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect("/admin/");
  });
});

router.get("/edit-product/:id", async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  console.log(product);
  res.render("admin/edit-product", { product });
});

router.post("/edit-product/:id", (req, res) => {
  console.log(req.params.id);
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect("/admin");
    if (req.files.image) {
      let image = req.files.image;
      let id = req.params.id;
      image.mv("./public/product-images/" + id + ".jpg");
    }
  });
});

module.exports = router;
