import moment from "moment";

const formatDate = (date, format) => {
    if (!date) return '';

    const dateFormat = format ? format : "MMM DD Y";
    const value = moment(new Date(date)).format(dateFormat);
    return value;
};

const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

export { formatDate, sleep };
