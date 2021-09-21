const fs = require("fs-extra")
const path = require("path")
const serverConfig = require("./server-config.json");

const baseUrl = `${serverConfig.protocol}://${serverConfig.host}:${serverConfig.port}`
const jsonOpts = serverConfig.json;

function abspath(relpath) {
  return path.join(__dirname, relpath);
}

function createNewUser() {
  return {
    name: "New",
    id: "urn:sketch:participant:" + Date.now().toString(32)
  }
}

function getDirNameFromUid(uid) {
  return getUserSuffixFromUid(uid)
}

function getUserBaseLocationFromUid(uid) {
  return `${baseUrl}/participant/${uid}`
}

function getUserSuffixFromUid(uid) {
  return uid.split(":")[3]
}

function createAssetEntry(id, name, filetype) {
  const uploadBase = getUserBaseLocationFromUid(id);
  const downloadBase = baseUrl + "/" + getDirNameFromUid(id);
  return {
    upload: `${uploadBase}/${name}`,
    download: `${downloadBase}/${name}.${filetype}`
  }
}

const middlewares = {

  sendNewUser: (req, res) => {
    res.json(createNewUser());
  },

  createConfig: (req, res) => {

    const id = req.params.id;
    const pdir = abspath(`${serverConfig.datadir}/${getDirNameFromUid(id)}`);

    const config = req.content;

    fs.pathExists(pdir, (err, exists) => {
      if (err) {
        res.status(500).end();
        console.log(err);
      } else if (!exists) {
        fs.mkdirpSync(pdir);

        config.labels = createAssetEntry(id, "labels", "json")
        config.sketch = createAssetEntry(id, "sketch", "json")
        config.tapTranscript = createAssetEntry(id, "tap-transcript", "json")
        config.retroTranscript = createAssetEntry(id, "retro-transcript", "json")
        config.tapVideo = createAssetEntry(id, "tap-video", "mp4")
        config.retroVideo = createAssetEntry(id, "retro-video", "mp4")
        config.correlations = createAssetEntry(id, "correlations", "json")

        fs.writeJSONSync(pdir + "/config.json", config, jsonOpts);

        middlewares.updateRegistry(req, res)

        res.json(config);
        console.log("Created config and stored resources", req.params.id);
      } else {
        console.log("Did not create config for existing user", req.params.id);
        res.status(409).end();
      }
    })
  },

  updateRegistry(req, res) {
    const cpath = abspath(`${serverConfig.datadir}/configs.json`)
    const user = req.content;
    fs.pathExists(cpath, (err, exists) => {
      if (err) {
        res.status(500).end();
        console.log(err);
      } else {
        let config = []
        if (exists) {
          config = fs.readJSONSync(cpath)
        }
        config.push(user);
        fs.writeJSONSync(cpath, config);
      }
    })
  },

  sendUserFile: (req, res) => {
    req.filename = `${getDirNameFromUid(req.params.id)}/${req.filename}`;
    middlewares.sendFile(req, res)
  },

  sendFile: (req, res) => {
    res.sendFile(abspath(`${serverConfig.datadir}/${req.filename}`), (err) => {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      } else {
        console.log('Sent:', req.filename);
      }
    });
  },

  writeJSONFile: (req, res) => {
    const fname = abspath(`${serverConfig.datadir}/${getDirNameFromUid(req.params.id)}/${req.filename}`);
    try {
      fs.writeJSONSync(fname, req.content, jsonOpts)
      res.json({
        message: "ok"
      });
      console.log('Wrote:', req.filename, "for", req.params.id);
    } catch (error) {
      console.log(err);
      res.status(err.status).end();
    }
  },

  writeVideoFile: (req, res) => {
    const content = req.files.file.data;
    const filename = `${req.path.split("/").pop()}.mp4`;
    fs.writeFile(abspath(`${serverConfig.datadir}/${getDirNameFromUid(req.params.id)}/${filename}`), content);
    res.send("ok");
  },

  parseRequest: (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      console.log("User data is file")
      const o = req.files.file.data.toString();
      req.content = JSON.parse(o);
    } else {
      console.log("User data is object")
      req.content = req.body;
    }
    next()
  }
}


module.exports = middlewares;
