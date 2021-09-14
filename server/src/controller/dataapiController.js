const http = require("http");
const express = require("express");
const dataapicontroller = express.Router();
require("dotenv/config");

dataapicontroller.get("/", async (req, res) => {
  var request = http.request({
    host: "இங்கே API கால் பண்ணவும்",
    method: 'GET',
    headers: {
     
    }

  }, function(response) {
    var data = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      res.end('check result: ' + data);
    });
  });
  request.end();
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
