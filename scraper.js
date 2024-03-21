const productService = require("./services/productService");

async function run() {
  try {
    //Product Discovery
    const url = "https://www.etsy.com";
    const products = await productService.discoverProducts(url);
    productService.writeProductsToFile("products.json", products);
    console.log(
      "Product discovery: Successfully wrote product information to products.json"
    );
    // Product Detail Extraction
    const detailedProducts = [];
    for (const product of products) {
      const detailedProduct = await productService.productDetails(product);
      detailedProducts.push(detailedProduct);
    }
    productService.writeProductsToFile(
      "detailedProducts.json",
      detailedProducts
    );
    console.log(
      "Product detail extraction: Successfully wrote detailed product information to detailedProducts.json"
    );
    console.log(detailedProducts[0].url);
    //Add to cart
    const addToCartProduct = await productService.addToCart(
      detailedProducts[0].url
    );

    if (addToCartProduct) {
      console.log("Product added to cart successfully.");
    } else {
      console.log("Failed to add product in cart.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
