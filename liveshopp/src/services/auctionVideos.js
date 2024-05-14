import axiosConfig from './config/axiosConfig';

const auctionVideos = {
    createNewAuctionVideo(data) {
        const formData = new FormData();
        formData.append('video', {
            uri: data.videoUrl.uri,
            type: 'video/mp4',
            name: 'video',
        });
        formData.append('data', JSON.stringify(data));

        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        return axiosConfig
            .post('/api/videos/create', formData, config)
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    processNewBid(data) {
        return axiosConfig
            .post('/api/videos/create-new-auction-video-bid', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    handleEndingAuction(data) {
        return axiosConfig
            .post('/api/videos/handle-ending-auction-video', {data})
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    getSellersAuctionVideo() {
        return axiosConfig
            .get('/api/videos/get-all-seller-auction-video')
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
    getSellerAuctionVideo() {
        return axiosConfig
            .get('/api/videos/get-seller-auction-video')
            .then(({data}) => data)
            .catch(({response}) => Promise.reject(response.data));
    },
};

export default auctionVideos;
