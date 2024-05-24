const { DateTime } = require('luxon');

const adjustAuctionEndTimeForTenMinutes = (auctionEndDate) => {
  const currentDate = DateTime.now();
  const endDate = DateTime.fromJSDate(auctionEndDate);

  const differenceMinutes = endDate.diff(currentDate, 'minutes').minutes;

  if (differenceMinutes < 10) {
    const updatedEndDate = endDate.plus({ minutes: 10 - differenceMinutes });
    return updatedEndDate.toJSDate();
  }

  return auctionEndDate;
};

const isLessThanTenSeconds = (timer) => {
  // Split the timer into minutes and seconds
  const [minutes, seconds] = timer.split(':').map(Number);
  // Convert the total time to seconds
  const totalTimeInSeconds = minutes * 60 + seconds;
  // Compare with 5 seconds
  return totalTimeInSeconds < 10;
};

const randomFourDigitNumber = () => Math.floor(1000 + Math.random() * 9000);

module.exports = { adjustAuctionEndTimeForTenMinutes, isLessThanTenSeconds, randomFourDigitNumber };
