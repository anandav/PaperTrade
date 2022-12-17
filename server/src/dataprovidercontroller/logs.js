const utility = require("./utility");

const Logger = {
    info: (...message) => {
        console.log(utility.formatDate(), 'INFO:', message.join(' '));
    },
    warn: (...message) => {
        console.warn(utility.formatDate(), 'WARNING:', message.join(' '));
    },
    error: (...message) => {
        console.error(utility.formatDate(), 'ERROR:', message.join(' '));
    }
};
module.exports = Logger;





