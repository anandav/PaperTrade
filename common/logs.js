const utility = require("./utility");

module.exports = {
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
