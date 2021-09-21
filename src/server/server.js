const express = require('express')
const path = require("path")
const cors = require('cors')
const fs = require("fs-extra");
const mw = require("./middleware");
const config = require("./server-config.json");
const marked = require("marked");
const fileUpload = require("express-fileupload");

const app = express();
const port = config.port;

// Create data directory if not exists
fs.mkdirpSync(path.join(__dirname, config.datadir));

app.use(cors())
app.use(express.static(path.join(__dirname, config.appdir), config.static));
app.use(express.static(path.join(__dirname, config.datadir), config.static));
app.use(express.json({
  limit: '50mb'
}))
app.use(fileUpload(config.upload));

app.get('/api', (req, res, next) => {
  const md = new TextDecoder().decode(fs.readFileSync(path.join(__dirname, "paths.md")));
  const home = wrapHTMLDoc(marked(md));
  res.send(home)
  next()
});

app.get("/healthy", (req, res) => {
  res.send("yes")
});

app.get("/configs", (req, res, next) => {
  req.filename = "configs.json";
  next();
}, mw.sendFile);


app.get("/participant/new", mw.sendNewUser);


app.post("/participant/:id/config", (req, res, next) => {
  req.content = req.body;
  next();
}, mw.createConfig);

app.post("/participant/:id/labels", (req, res, next) => {
  req.content = req.body;
  req.filename = "labels.json";
  next()
}, mw.parseRequest, mw.writeJSONFile);

app.post("/participant/:id/*-transcript", (req, res, next) => {
  req.content = req.body;
  req.filename = `${req.path.split("/").pop()}.json` //"transcript.json";
  next();
}, mw.parseRequest, mw.writeJSONFile);

app.post("/participant/:id/sketch", (req, res, next) => {
  req.content = req.body;
  req.filename = "sketch.json";
  next();
}, mw.parseRequest, mw.writeJSONFile);

app.post("/participant/:id/correlations", (req, res, next) => {
  req.content = req.body;
  req.filename = "correlations.json";
  next();
}, mw.parseRequest, mw.writeJSONFile);

app.post("/participant/:id/*-video", mw.writeVideoFile);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function wrapHTMLDoc(content) {
  return `
    <!DOCTYPE HTML>
    <html>
      <head>
      <meta charset="utf-8">
      <title>API</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
}
