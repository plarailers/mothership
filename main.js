const readline = require('readline');
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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', (line) => {
  console.log(`input: ${line}`);
  const channel = line | 0;
  const commands = {
    1: Signal.Ahead,
    2: Signal.Back,
    3: Signal.Stop,
  };
  if (channel in commands) {
    arduino.write(commands[channel]);
  }
});

everyMinute((timestamp) => {
  const commands = sampleData.schedule[timestamp];
  if (commands) {
    for (const command of commands) {
      arduino.write(command);
    }
  }
});
