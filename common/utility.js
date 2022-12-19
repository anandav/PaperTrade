module.exports = {
    formatDate: () => {
        //// AI Generated
        var date = new Date();
        const year = date.getFullYear();
        const month = module.exports.getMonthName(date.getMonth());
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ms = String(date.getMilliseconds()).padStart(3, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${ms}`;
    },

    getMonthName: (monthIndex) => {
        //// AI Generated
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[monthIndex];
    }
};
