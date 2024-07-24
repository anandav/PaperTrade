const utility = require("./utility");

module.exports = new function () {
    this.log = (...message) => {
        this.info(message);
    }
    this.info = (...message) => {
        console.log(utility.formatDate(), 'INFO:', message.join(' '));
    }
    this.warn = (...message) => {
        // let isString = message => typeof message === 'string' || message instanceof String;
        // console.warn(isString());
        if (message.length == 1) {
            console.warn(utility.formatDate(), 'WARNING:', message);
        } else {
            console.warn(utility.formatDate(), 'WARNING:', message.join(' '));
        }
    }
    this.error = (...message) => {
        console.error(utility.formatDate(), 'ERROR:', message.join(' '));
    }
};
