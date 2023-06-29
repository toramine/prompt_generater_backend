const express = require("express");
const app = express();
const cors = require('cors')
const port = 3060;
const text2imgRoute = require("./routes/text2img");
const uploadRoute = require("./routes/upload");
const path = require("path");

// ミドルウェア
app.use(cors())
app.use(express.json());
app.use("/api/text2img", text2imgRoute);
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api/upload", uploadRoute);

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server listening on port 3060");
});
