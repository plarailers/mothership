const SerialPort = require('serialport');
const { ByteLength, Readline } = SerialPort.parsers;


/**
 * 32 ビット整数 → 4 バイト配列
 * @param {Number} signal
 * @returns {Buffer}
 */
const pack = (signal) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(signal);
  return buffer;
};

/**
 * 4 バイト配列 → 32 ビット整数
 * @param {Buffer} buffer
 * @returns {Number}
 */
const unpack = (buffer) => {
  return buffer.readUInt32BE();
};


class Arduino {
  constructor() {
    this.port = new SerialPort('COM3', {
      baudRate: 9600,
    });

    this.port.on('open', () => {
      console.log('serial open');
    });

    // this.parser = this.port.pipe(new Readline());
    this.parser = this.port.pipe(new ByteLength({ length: 4 }));

    this.parser.on('error', (err) => {
      console.error(err);
    });
  }

  onData(callback) {
    this.parser.on('data', (data) => {
      console.log(`recv:`, data);
      callback(unpack(data));
    });
    return this;
  }

  write(data) {
    const buffer = pack(data);
    console.log(`send:`, buffer);
    this.port.write(buffer);
    return this;
  }
}

module.exports.Arduino = Arduino;
