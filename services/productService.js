const productRepo = require("../repositories/productRepository");

async function discoverProducts() {
  try {
    const products = await productRepo.discoverProducts();
    return products;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function productDetails(product) {
  try {
    const products = await productRepo.extractProductDetails(product);
    return products;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function addToCart(url) {
  try {
    return await productRepo.addToCart(url);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function writeProductsToFile(fileName, products) {
  try {
    await productRepo.writeProductsToFile(fileName, products);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = {
  discoverProducts,
  writeProductsToFile,
  productDetails,
  addToCart,
};
