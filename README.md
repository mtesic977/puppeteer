Puppeteer project for discovering products, product details and simulating add to cart and checkout page.

Requirements :

- Node.JS LTS version
- If you prefer some IDE for coding

Setting up project:

- Clone git repository
- Navigate to project folder and run $ npm install (installing dependencies)
- For staring project run $ npm start it will run scraper.js (main file)
- For starting unit test run $ npx jest

TO DO:

- Solving captcha is now done manually, which mean executing script will be stopped until user solve it manually and after that will continue. Need to be tested further. Potential bugs.
- Bypassing captcha can be done using third parties or with extra plugins. Check the documentation
- Solving problem if we get blocked even after solving captcha
- Multiple select menu on product details page should be fixed
- Add more unit tests.
