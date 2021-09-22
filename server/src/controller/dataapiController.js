const https = require("https");
const express = require("express");
const dataapicontroller = express.Router();
require("dotenv/config");


dataapicontroller.get("/", async (req, res) => {
  var data = 'symbol=NIFTY';
  console.log('data :>> ', data);
  var options = {
    host: 'www.nseindia.com',
    port: 80,
    path: '/api/option-chain-indices?symbol=BANKNIFTY',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data),
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0'
    },
    body: JSON.stringify({
      symbol: "NIFTY"
    })
  };
  https.globalAgent.options.secureProtocol = 'TLSv1.2'
  //https.globalAgent.options.secureProtocol = 'SSLv3_method'
  var httpreq = https.request(options, function (response) {
    console.log('response :>> ', response);
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
    });
    response.on('end', function () {
      res.send('ok');
    })
  });
  httpreq.on('error', function (e) {
    console.log('error :>> ', e);
  });
  httpreq.write(data);
  httpreq.end();

  // var request = http.request({
  //   host: "இங்கே API கால் பண்ணவும்",
  //   method: 'GET',
  //   headers: {

  //   }

  // }, function (response) {
  //   var data = '';
  //   response.setEncoding('utf8');
  //   response.on('data', (chunk) => {
  //     data += chunk;
  //   });
  //   response.on('end', () => {
  //     res.end('check result: ' + data);
  //   });
  // });
  // request.end();
});


// dataapicontroller.post("/find", async (req, res) => {
//   var { fieldName, fieldValue } = req.body;
//   var result = {};
//   if (fieldName && fieldValue) {
//     result = await Portfolio.find({ [fieldName]: fieldValue });
//   } else {
//     result = await Portfolio.find();
//   }
//   res.send(result);
// });

// dataapicontroller.post("/save", async (req, res) => {
//   const { _id, name, description, createdon, updateui } = req.body;
//   var _portfolioObject = {};
//   if (_id) {
//     _portfolioObject = await commonUtility.GetPortfolioById(_id);
//     _portfolioObject.name = name;
//     _portfolioObject.description = description;
//     _portfolioObject.modifiedon = new Date();
//   } else {
//     _portfolioObject = new Portfolio({ name, description, createdon });
//   }
//   try {
//     const result = await _portfolioObject.save();
//     if (updateui) {
//       const _allportfolio = await Portfolio.find();
//       res.send(_allportfolio);
//     } else {
//       res.send(result);
//     }
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });


// dataapicontroller.post("/delete", async (req, res) => {
//   if (req.body._id) {
//     Portfolio.deleteOne({ _id: req.body._id }, (err, doc) => {
//       res.send(doc);
//     });
//   }
// });

module.exports = dataapicontroller;
