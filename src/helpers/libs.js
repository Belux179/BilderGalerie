const helpers = {};

helpers.randomNumber = () => {
      const possible = 'abcdefghijklmnopqrstuvwxyz-1234567890';
      let randString =0;
      for(let i = 0; i<7;i++){
        randString += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return randString;
};

module.exports =helpers;
