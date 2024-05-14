const handleAuctionVideos = require('../utils/auctionVideosHandler');
const AuctionVideoItem = require('../models/auction_videos_items');
const VideosItem = require('../models/auction_video');
const mockingoose = require('mockingoose');
const flushPromises = require('flush-promises');

jest.mock('../models/auction_videos_items'); // Mock VideosItem
jest.mock('../models/auction_video'); // Mock AuctionVideoItem

describe('handleInterval', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Efface tous les appels simulés avant chaque test
    });

    it('should handle expired auctions with no bids placed', async () => {
        mockingoose(VideosItem).toReturn([], 'find');

        await handleAuctionVideos();
        await flushPromises();

        const logSpy = jest.spyOn(global.console, 'log');

        expect(logSpy).toHaveBeenCalledWith("No auction videos ended");

        expect(AuctionVideoItem.find).toHaveBeenCalledWith({
            auctionEndDate: { $lte: expect.any(Date) },
            auctionStatus: 'onGoing'
        });
    });

    // it('should handle expired auctions with no bids placed and send notifications', async () => {
    //     VideosItem.find.mockResolvedValue([{ _id: 'mockAuctionId', seller_id: 'mockSellerId' }]);
    //     AuctionVideoItem.find.mockResolvedValue([]); // Simuler aucune offre pour cette enchère expirée
    //
    //     await handleInterval();
    //
    //     expect(VideosItem.find).toHaveBeenCalledWith({
    //         auctionEndDate: { $lte: expect.any(Date) },
    //         auctionStatus: 'onGoing'
    //     });
    //
    //     expect(AuctionVideoItem.find).toHaveBeenCalledWith({
    //         auctionItemId: 'mockAuctionId',
    //         auctionItemStatus: 'onGoing'
    //     });
    //
    //     // Vous devriez ajouter d'autres assertions pour vérifier d'autres comportements attendus
    // });

    // Ajoutez d'autres cas de test pour les autres scénarios du code handleInterval
});
