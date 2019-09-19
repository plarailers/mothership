/*
  関数を１分毎に定期実行させる。
*/

process.env.TZ = 'Asia/Tokyo';

const cron = require('node-cron');


const everyMinute = (task) => {
  cron.schedule('* * * * *', () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timestamp = `${hours}${`${minutes}`.padStart(2, '0')}`;
    console.log(`task called at ${timestamp}`);
    task(timestamp);
  });
};

module.exports.everyMinute = everyMinute;
