import dayjs from 'dayjs';

export default {
  formatDateTime(value) {
    if (value) {
      const format = value.length <= 10 ? 'DD-MMM-YYYY' : 'DD-MMM-YYYY HH:mm';
      return dayjs(value, ['YYYY', 'YYYY-MM-DD'], 'in', true).format(format);
    }
    return '';
  },
  formatDate(value) {
    if (value) {
      return dayjs(value, ['YYYY', 'YYYY-MM-DD'], 'in', true).format('DD-MMM-YYYY');
    }
    return '';
  },
  decimal2(value) {
    if (value) {
      return parseFloat(value).toFixed(2);
    }
    return '';
  },
};
