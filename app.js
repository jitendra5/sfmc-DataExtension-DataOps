var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var axios = require('axios');
const path = require('path');
const ET_Client = require('sfmc-fuelsdk-node');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.sendFile(path.join(__dirname+'/index.html'));
});
app.post('/connectsfmc',urlencodedParser, function (req, res) {
  //console.log(req);
  console.log(req.body);
  var authObj ={};
  authObj['grant_type'] ='client_credentials';
  authObj['client_id'] =req.body.client_id;
  authObj['client_secret'] =req.body.client_secret;

  console.log('authObj: ');
  console.log(authObj);
  var dataObj ={};
  dataObj =req.body.jsonData;
  console.log('dataObj: '+dataObj);
  var hostname =req.body.hostname;
  console.log('hostname: '+hostname);
  var externalKey =req.body.extKey;
  console.log('externalKey: '+externalKey);

 let sfmcDataExtensionApiUrl ='https://'+hostname+'.rest.marketingcloudapis.com/hub/v1/dataevents/key:'+externalKey+'/rowset';
 console.log('sfmcDataExtensionApiUrl: '+sfmcDataExtensionApiUrl); 
 let getMCAccessToken = function sfmcToken(){
    return new Promise(function(resolve, reject) {
        request.post(
          'https://'+hostname+'.auth.marketingcloudapis.com/v2/token',
          { json: req.body },
          function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log(body);
                  resolve(body);
              }
          }
      );
    })
  }
  
  var connectToDE = function DEfn(accToken, jsonData){
    return new Promise(function(resolve,reject){
        let headers = {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + accToken
      };
      console.log('headers-------');
      console.log(headers);
      console.log('jsonData-------');
      console.log(jsonData);
      var jsonDataRep = jsonData.replace(/'/g, '"');
      console.log(jsonDataRep);
      axios.post(sfmcDataExtensionApiUrl, jsonDataRep, {"headers" : headers})
            .then((response) => {
                // success
                console.log("Successfully loaded sample data into Data Extension!");
                resolve(
                {
                    status: response.status,
                    statusText: response.statusText + "\n" + (JSON.stringify(response.data))
                });
                
            })
            .catch((error) => {
                // error
                let errorMsg = "Error loading sample data. POST response from Marketing Cloud:";
                errorMsg += "\nMessage: " + error.message;
                errorMsg += "\nStatus: " + error.response ? error.response.status : "<None>";
                errorMsg += "\nResponse data: " + error.response.data ? (JSON.stringify(error.response.data)) : "<None>";
                console.log(errorMsg);
                reject(errorMsg);
            });
    })
  }

  var getSfmcToken = getMCAccessToken();
  getSfmcToken.then(function(token){
    console.log('token here..');
    console.log(token.access_token);
    /*let jsonData =[
      {
          "keys":{
                  "Email": "someone500@example.com"
                  },
          "values":{
                  "Gender": "Male"
                  }
      },
      {
          "keys": {
                  "Email": "someone400@example.com"
                  },
          "values":{
                  "Gender": "FeMale"
                  }
      }
  ]  */
    connectToDE(token.access_token,dataObj).then((resp)=>{
      console.log(resp);
      res.send(resp);
    }).catch((resp)=>{
      console.log(resp);
      res.send(resp);
    })
  });
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});