const Utility = {
    formatDate: () => {
        var date = new Date();
        const year = date.getFullYear();
        const month = Utility.getMonthName(date.getMonth());
        //const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ms = String(date.getMilliseconds()).padStart(3, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${ms}`;
    },

    //// OpenAI Generated
    getMonthName: (monthIndex) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[monthIndex];
    }
};

module.exports = Utility;