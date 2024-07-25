var express = require("express");
const {
  publishMessage,
  subscribeToChannel,
} = require("../middleware/pubnubService");
const bodyParser = require("body-parser");

/* GET users listing. */

const pubnubRouter = express.Router();

pubnubRouter.use(bodyParser.json());

pubnubRouter
  .route("/")
  .get((req, res, next) => {
    // res.statusCode = 200;
    // res.setHeader("Content-Type", "application/json");
    // res.json({
    //   message: "Success",
    //   data: `User Retrived Success`,
    // });
  })
  .post((req, res, next) => {
    const { channel, message } = req.body;
    publishMessage(channel, message);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      message: message,
    });
  });

module.exports = pubnubRouter;
