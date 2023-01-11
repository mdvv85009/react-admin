function timestampToDate(timestamp) {
  let date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

function DateToTimestamp(date) {}

function isPass(timestamp) {
  let date = new Date(timestamp * 1000);
  let dateNow = new Date();
  return date > dateNow ? true : false;
}

export { timestampToDate, DateToTimestamp, isPass };
