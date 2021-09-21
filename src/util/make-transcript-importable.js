/**
 * Read line mechanism from: https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
 */

const fs = require('fs');
const fsextra = require("fs-extra");
const readline = require('readline');
const commandLineArgs = require('command-line-args');
const path = require("path");

const optionDefinitions = [{
  name: 'file',
  alias: 'f',
  type: String
}, ]

const Speaker = function (id) {
  this.id = id;
  this.name = id;
}

const Transcript = function () {
  this.meta = {
      speakers: [],
      duration: 0
    },
    this.data = []
}

const options = commandLineArgs(optionDefinitions)


async function processLineByLine(file) {
  const filename = path.resolve(file)
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  const transcript = new Transcript();
  for await (const line of rl) {
    let word = parseLine(line);
    if (word) {
      // console.log(word)
      transcript.data.push(word);
    }
  }

  if (transcript.data.length) {
    let speakers = [...new Set(transcript.data.map(w => w.speaker))]
    speakers = speakers.map(s => new Speaker(s))
    transcript.meta.speakers = speakers;
    const times = transcript.data.map(w => w.time)
    transcript.duration = Math.max(...times);

    // Current transcripts not monotonous
    // --> Delete all successors after second appearence with lower time value then duration
    const firstEndAt = transcript.data.findIndex(w => w.time === transcript.duration);
    console.log(firstEndAt)

    transcript.data = transcript.data.slice(0, firstEndAt + 1)
    console.log(transcript)
    const outfile = path.resolve(path.dirname(filename), "importable-" + path.basename(file));
    fsextra.writeJSONSync(outfile, transcript, {
      "spaces": 2
    })
  }


}

function parseLine(line) {
  let text = line.match(/(?<=word: ')(.*?)(?=\',)/g);
  let time = line.match(/(?<=start_time: )(.*?)(?=\,)/g);
  let speaker = line.match(/(?<=speaker_tag: )(.*)/g);

  if (text && time && speaker) {
    text = text[0];
    time = Math.round(parseFloat(time[0]) * 1000);
    speaker = "s" + speaker[0];
    return {
      text,
      time,
      speaker
    }
  } else {
    return null;
  }
}

if (options.file) {
  processLineByLine(options.file);
} else {
  console.error("Missing command line paramenter file ('-f' or '--file')")
}
