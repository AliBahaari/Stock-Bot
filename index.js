const axios = require('axios');
const base64Img = require('base64-img');
const tesseract = require('tesseract.js');

class StockBot {
  
  constructor(username, password, isin = '', orderSide = 0, orderPrice = 0, orderCount = 0, symbolName = '') {

    this.username = username;
    this.password = password;

    this.isin = isin;
    this.orderSide = orderSide; // 65 -> Buy | 86 -> Sell
    this.orderPrice = orderPrice;
    this.orderCount = orderCount;

    this.symbolName = symbolName;
    
  }

  // Properties

  captchaCode = '';
  captchaKey = '';

  token = '';

  // Methods

  solveCaptcha = () => {

    return new Promise((resolve, reject) => {

      axios({
        method: 'get',
        url: 'https://api.samanbourse.com/web/v1/Authenticate/GetCaptchaImage/Captcha'
      }).
      then(resp => {
  
        let captcha = resp.data.Data.Captcha;
  
        base64Img.imgSync('data:image/png;base64,' + captcha, '', 'Captcha', (err, filepath) => {
          console.log(err, filepath);
        });
  
        tesseract.recognize(__dirname + '/Captcha.png', 'eng').then(({ data: { text } }) => {
  
          let captchaCode = [...text.matchAll(/\d/g)].join('');
  
          this.captchaCode = captchaCode;
          this.captchaKey = resp.data.Data.CaptchaKey;
          
          console.log('Captcha - OK');
          resolve(1);
  
        });
  
      }).
      catch(() => {

        console.log('Captcha - Error');
     
      });

    });

  }

  logIn = () => {

    return new Promise((resolve, reject) => {

      axios({
        method: 'post',
        url: 'https://api.samanbourse.com/web/v1/Authenticate/Login',
        data: {
          UserName: this.username,
          Password: this.password,
          Captcha: this.captchaCode,
          CaptchaKey: this.captchaKey
        }
      }).
      then(resp => {
        
        this.token = resp.data.Data.Token;
  
        console.log('Log In - OK');
        resolve(1);
  
      }).
      catch(() => {

        console.log('Log In - Error');

      });

    });

  }

  showPortfolio = () => {

    axios({
      method: 'get',
      url: 'https://api.samanbourse.com/web/v1/DailyPortfolio/LightDailyPortfolioMobile?symbolIsin=',
      headers: { 'authorization': 'BasicAuthentication ' + this.token }
    }).
    then(resp => {

      console.log(resp.data.Data);

      console.log('Portfolio - OK');

    }).
    catch(() => {

      console.log('Portfolio - Error');

    });

  }

  submitOrder = () => {

    let now = new Date();
    let targetTime = new Date();
    targetTime.setHours(8);
    targetTime.setMinutes(45);
    targetTime.setSeconds(0);
    
    let delay = targetTime - now;

    setTimeout(() => {

      axios({
        method: 'post',
        url: 'https://api.samanbourse.com/web/v1/Order/Post',
        data: {
          orderCount: this.orderCount,
          orderPrice: this.orderPrice,
          FinancialProviderId: 1,
          isin: this.isin,
          orderSide: this.orderSide,
          orderValidity: 74,
          orderValiditydate: "",
          maxShow: 0,
          orderId: 0
        },
        headers: { 'authorization': 'BasicAuthentication ' + this.token }
      }).
      then(resp => {
  
        if (resp.data.IsSuccessfull === false) {

          this.submitOrder();

        } else {

          console.log(resp.data);
  
          console.log('Submit Order - OK');

        }
  
      }).
      catch(err => {
  
        console.log('Submit Order - Error', err);

        this.submitOrder();
  
      });

    }, delay);

  }

  searchIsin = () => {

    let encodedUri = encodeURI('https://api.samanbourse.com/Web/V1/Symbol/GetSymbol?term=' + this.symbolName);

    axios({
      method: 'get',
      url: encodedUri,
      headers: { 'authorization': 'BasicAuthentication ' + this.token }
    }).
    then(resp => {

      console.log(resp.data);

      console.log('Search ISIN - OK');

    }).
    catch(() => {

      console.log('Search ISIN - Error');

    });

  }

}

const stockBot = new StockBot(<USERNAME>, <PASSWORD>, <ISIN>, <SIDE>, <PRICE>, <COUNT>, <SYMBOL>);
stockBot.solveCaptcha().then(stockBot.logIn).then(stockBot.submitOrder);