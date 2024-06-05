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

const randomFourDigitNumber = () => Math.floor(1000 + Math.random() * 9000);

module.exports = { adjustAuctionEndTimeForTenMinutes, randomFourDigitNumber };
