const puppeteer = require("puppeteer");
const fs = require("fs");

const captchaRepo = require("../repositories/captchaRepository");

async function discoverProducts(url) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    captchaRepo.automateProcessWithCaptcha(page);

    await page.waitForSelector(
      ".categories-grid.categories-grid--initial-categories.wt-block-grid-xs-1.wt-block-grid-lg-6.wt-pb-xs-1"
    );

    const productInfos = await page.evaluate(() => {
      const products = [];
      const productElements = document.querySelectorAll(
        "div.categories-grid.categories-grid--initial-categories.wt-block-grid-xs-1.wt-block-grid-lg-6.wt-pb-xs-1 > .wt-block-grid__item"
      );

      for (const element of productElements) {
        const product = {};
        product.name = element
          .querySelector(
            ".wt-text-title-small.wt-text-truncate.wt-ml-xs-2.wt-ml-lg-0.wt-mt-lg-2.wt-text-center-lg"
          )
          .textContent.trim();
        product.url = element.querySelector(".wt-card__action-link").href;
        products.push(product);
      }

      return products.slice(0, 10); // Return only the first 10 products
    });

    await browser.close();

    return productInfos;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function extractProductDetails(product) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto(product.url, { waitUntil: "networkidle2" });

    captchaRepo.automateProcessWithCaptcha(page);

    await page.waitForSelector(
      "ol.wt-grid.wt-grid--block.wt-pl-xs-0.tab-reorder-container"
    );

    const newUrl = await page.evaluate(() => {
      const url = document.querySelector(
        "ol.wt-grid.wt-grid--block.wt-pl-xs-0.tab-reorder-container > li:first-child > div > div > a"
      );
      return url ? url.href : null;
    });

    captchaRepo.automateProcessWithCaptcha(page);

    if (newUrl) {
      await page.goto(newUrl, { waitUntil: "networkidle2" });

      captchaRepo.automateProcessWithCaptcha(page);

      const productInfo = await page.evaluate(() => {
        const product = {};
        // product.name = document
        //   .querySelector(".wt-mb-xs-1.wt-text-body-03")
        //   .textContent.trim();
        const priceElement = document.querySelector(
          ".wt-text-title-larger.wt-mr-xs-1"
        );
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          const priceIndex = priceText.lastIndexOf("USD");
          if (priceIndex !== -1) {
            // Extracting just the price value
            const price = priceText.substring(priceIndex).trim();
            product.price = price;
          }
        }

        product.description = document
          .querySelector(
            ".wt-text-body-01.wt-line-height-tight.wt-break-word.wt-mt-xs-1"
          )
          .textContent.trim();

        const selectElement = document.querySelector("#variation-selector-0");
        if (!selectElement) {
          return [];
        }

        const options = Array.from(selectElement.querySelectorAll("option"));
        product.sizes = options.map((option) => option.textContent.trim());

        product.image = document.querySelector(
          ".wt-max-width-full.wt-horizontal-center.wt-vertical-center.carousel-image.wt-rounded"
        ).src;

        product.url = window.location.href;

        return product;
      });

      await new Promise((r) => setTimeout(r, 2000));

      await browser.close();

      return productInfo;
    } else {
      await browser.close();
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Add to cart contain also checkout functionally because of cart expiration
async function addToCart(url) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    captchaRepo.automateProcessWithCaptcha(page);

    await new Promise((r) => setTimeout(r, 2000));

    await page.evaluate(() => {
      const requiredLabels = document.querySelectorAll(
        "label .wt-label__required"
      );

      requiredLabels.forEach((requiredSpan) => {
        const label = requiredSpan.closest("label");
        if (label) {
          const inputId = label.getAttribute("for");
          if (inputId) {
            const inputField = document.getElementById(inputId);
            if (inputField) {
              if (inputField.tagName === "INPUT") {
                inputField.value = "value";
              } else if (inputField.tagName === "SELECT") {
                const optionIndex = 1;
                inputField.selectedIndex = optionIndex;
                const changeEvent = new Event("change", { bubbles: true });
                inputField.dispatchEvent(changeEvent);
              }
            }
          }
        }
      });
    });

    await new Promise((r) => setTimeout(r, 2000));

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(".wt-btn.wt-btn--filled.wt-width-full"),
    ]);

    captchaRepo.automateProcessWithCaptcha(page);

    await page.waitForSelector("#checkout");

    await page.click('[data-selector="cart-submit-button"]');

    captchaRepo.automateProcessWithCaptcha(page);

    await new Promise((r) => setTimeout(r, 2000));

    await page.waitForSelector("#join-neu-action-context");

    await new Promise((r) => setTimeout(r, 2000));

    await page.click(".wt-btn.wt-btn--secondary.wt-width-full");

    captchaRepo.automateProcessWithCaptcha(page);

    checkout(page, browser);
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
}

async function checkout(page, browser) {
  try {
    // Define an array of input fields and their corresponding values
    await new Promise((r) => setTimeout(r, 3000));

    const fields = [
      { selector: 'input[name="email_address"]', value: "value1@gmail.com" },
      {
        selector: 'input[name="email_address_confirmation"]',
        value: "value1@gmail.com",
      },
      { selector: 'input[name="name"]', value: "John Doe" },
      { selector: 'input[name="first_line"]', value: "Address 1" },
      { selector: 'input[name="city"]', value: "New Now" },
    ];

    await page.waitForSelector("#shipping-address-form", {
      visible: true,
      timeout: 10000,
    });
    // Loop through the fields array and fill in each input field
    for (const field of fields) {
      await new Promise((r) => setTimeout(r, 2000));
      await page.waitForSelector(field.selector, {
        visible: true,
        timeout: 5000,
      });
      await page.type(field.selector, field.value);
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click(".wt-btn.wt-btn--filled.wt-width-full"),
    ]);

    captchaRepo.automateProcessWithCaptcha(page);

    await new Promise((r) => setTimeout(r, 2000));

    browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function writeProductsToFile(fileName, products) {
  try {
    fs.writeFileSync(`data/${fileName}`, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = {
  discoverProducts,
  writeProductsToFile,
  extractProductDetails,
  addToCart,
};
