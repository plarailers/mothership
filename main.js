const { everyMinute } = require('./schedule');
const { Arduino } = require('./serial');
const { sampleData } = require('./diagram');
const Signal = require('./signal');

const arduino = new Arduino();

arduino.onData((data) => {
  for (const [key, value] of Object.entries(Signal)) {
    if (data === value) {
      console.log(key);
      return;
    }
  }
  console.log(`Unknown`);
});

everyMinute((timestamp) => {
  const commands = sampleData.schedule[timestamp];
  if (commands) {
    for (const command of commands) {
      arduino.write(command);
    }
  }
});
