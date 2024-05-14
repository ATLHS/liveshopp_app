const {DateTime} = require("luxon");

const adjustAuctionEndTimeForTenMinutes = auctionEndDate => {
    const currentDate = DateTime.now();
    const endDate = DateTime.fromJSDate(auctionEndDate);

    const differenceMinutes = endDate.diff(currentDate, 'minutes').minutes;

    if (differenceMinutes < 10) {
        const updatedEndDate = endDate.plus({ minutes: 10 - differenceMinutes });
        return updatedEndDate.toJSDate();
    }

    return auctionEndDate;
};

module.exports = adjustAuctionEndTimeForTenMinutes;