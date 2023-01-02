const utility = require("./utility");

module.exports = new function () {
    this.log = (...message) => {
        this.info(message);
    }
    this.info = (...message) => {
        console.log(utility.formatDate(), 'INFO:', message.join(' '));
    }
    this.warn = (...message) => {
        console.warn(utility.formatDate(), 'WARNING:', message.join(' '));
    }
    this.error = (...message) => {
        console.error(utility.formatDate(), 'ERROR:', message.join(' '));
    }
};
