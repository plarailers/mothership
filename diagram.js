const fs = require('fs');
const util = require('util');

const Signal = require('./signal');


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const readOuDia = async (path) => {
  const content = await readFileAsync(path, { encoding: 'utf8' });
  const stops = readStops(content);
  const trains = readTrains(content);
  const timetable = readTimetable(content);
  await writeFileAsync('./timetable.json', JSON.stringify({ stops, trains, timetable }, null, '\t'));
};

readOuDia('./diagram.oud');

const readStops = (content) => {
  const re = /Eki\.\r\nEkimei=([^\r\n]*)/g;
  let stops = [];
  let res = null;
  while (res = re.exec(content)) {
    stops.push(res[1]);
  }
  return stops;
};

const readTrains = (content) => {
  const re = /Ressyasyubetsu\.\r\nSyubetsumei=([^\r\n]*)/g;
  let trains = [];
  let res = null;
  while (res = re.exec(content)) {
    trains.push(res[1]);
  }
  return trains;
};

const readTimetable = (content) => {
  const re = /Ressya\.\r\nHoukou=([^\r\n]*)\r\nSyubetsu=([^\r\n]*)\r\nEkiJikoku=([^\r\n]*)/g;
  let res = null;
  let timetable = [];
  const parseStop = (s) => {
    let m = null;
    if (m = s.match(/^1;(\d+)$/)) return [null, m[1]];
    if (m = s.match(/^1;(\d+)\/(\d+)$/)) return [m[1], m[2]];
    if (m = s.match(/^1;(\d+)\/$/)) return [m[1], null];
    if (m = s.match(/^2$/)) return [null, null];
    console.error(s);
  };
  while (res = re.exec(content)) {
    timetable.push({
      dir: res[1],
      type: res[2],
      time: res[3].split(',').map(parseStop),
    });
  }
  return timetable;
};

const indent = (content) => {
  let result = '';
  let level = 0;
  for (const line of content.split('\r\n')) {
    result += '\t'.repeat(level);
    result += line;
    result += '\n';
    if (line === '.') {
      level -= 1;
    } else if (line.endsWith('.')) {
      level += 1;
    }
  }
  return result;
};

const sampleData = {
  stations: [
    '東京',
    '小田原',
    '静岡',
    '名古屋',
    '米原',
    '新大阪',
  ],
  trains: [
  ],
  schedule: {
    // 時刻: [信号]
    '600': [
      Signal.Ahead,
    ],
  },
};

module.exports.sampleData = sampleData;
