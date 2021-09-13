
# Saman Bank Broker Bot

This is a bot for Saman bank broker which tries to achieve the first rows in queues in pre-opening (for selling and buying shares).


## Usage/Examples

First, clone the project and after that enter the command below:
```bash
cd saman-bank-broker-bot
```

Then, open `index.js` file and change this line:
```javascript
const stockBot = new StockBot(<USERNAME>, <PASSWORD>, <ISIN>, <SIDE>, <PRICE>, <COUNT>, <SYMBOL>);
```

***Note***: `<SYMBOL>` is optional and only for using `searchIsin` method to get **ISIN** code for the `submitOrder` method like below:
```javascript
stockBot.solveCaptcha().then(stockBot.logIn).then(stockBot.searchIsin);
```

Finally, try `npm start` as far as it can solve the captcha.

Congratulation! Automatically it will send your requests at 8:45.

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  