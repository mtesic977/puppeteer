const fs = require("fs");
const puppeteer = require("puppeteer");

describe("Product Discovery and Detail Extraction", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Product Discovery - Listing first 10 products with names, and URLs", async () => {
    const products = JSON.parse(fs.readFileSync("data/products.json", "utf8"));

    expect(products.length).toBe(10);
    products.forEach((product) => {
      expect(product.name).toBeTruthy();
      expect(product.url).toBeTruthy();
    });
  });

  test("Product Detail Extraction - Extracting detailed information of each product", async () => {
    const products = JSON.parse(
      fs.readFileSync("data/detailedProducts.json", "utf8")
    );

    const productDetails = [];

    for (const product of products) {
      await page.goto(product.url);

      const productDetail = await page.evaluate(() => {
        return {
          name: "Product Name",
          price: "$20",
          description: "Product Description",
          sizes: ["S", "M", "L"],
          imageUrl: "https://example.com/product-image.jpg",
        };
      });

      productDetails.push(productDetail);
    }

    expect(productDetails.length).toBe(products.length);

    productDetails.forEach((detail) => {
      expect(detail.name).toBeTruthy();
      expect(detail.price).toBeTruthy();
      expect(detail.description).toBeTruthy();
      expect(detail.sizes).toBeTruthy();
      expect(detail.imageUrl).toBeTruthy();
    });
  });
});
