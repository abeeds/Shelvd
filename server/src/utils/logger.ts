import dayjs from 'dayjs';
const pino = require('pino');


const log = pino({
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
});


export default log;