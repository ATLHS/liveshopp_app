/*const ioc = require('socket.io-client');
const { Server } = require('http');
const { app, httpServer } = require('../app');
const timer = require("time-counter");

// Lancez le serveur socket.io pour les tests
let socket;

describe('Tests pour les sockets', () => {
    let io, serverSocket, clientSocket;

    /!*beforeEach((done) => {
        io = new Server(app);
        io.on("connection", (socket) => {
            console.log("connection!!!");
            serverSocket = socket;
            done();
        });
    });*!/

    /!*test('onBid should update auction data',  () => {
        const serverSpy = jest.spyOn(httpServer, 'listen').mockImplementation(() => jest.fn());
        app.start();
        // ... votre logique de test ...

        expect(serverSpy).toHaveBeenCalled();
    });*!/
});*/

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require("socket.io-client");
const timer = require("time-counter");

function waitFor(socket, event) {
    return new Promise((resolve) => {
        socket.once(event, resolve);
    });
}

describe("my awesome project", () => {
    let io, serverSocket, clientSocket;

    beforeEach((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = ioc(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterEach(() => {
        io.close();
        clientSocket.disconnect();
    });

    it("should work", async (done) => {
        await clientSocket.emit("bid", {
            channelName: '',
            sellerId: '',
            sellerName: '',
            auctionId: '',
            auctionsStatus: '',
            userCount: 1,
            messages: [],
            hostIsLive: true,
            currentAuction: {
                userId: '',
                username: '',
                productName: '',
                currentProductAmount: '',
                currentAuctionDelay: new timer(),
                currentAuctionStatus: 'paused',
                salePrice: '',
            }
        });

        await clientSocket.on('currentAuctionData', message => {
            expect(message).toBe('Hello World');
        })



       /* serverSocket.on('bid', (message) => {
            // Check that the message matches

            done();
        });*/
    });

    /*

    it("should work with an acknowledgement", (done) => {
        serverSocket.on("hi", (cb) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg) => {
            assert.equal(arg, "hola");
            done();
        });
    });

    it("should work with emitWithAck()", async () => {
        serverSocket.on("foo", (cb) => {
            cb("bar");
        });
        const result = await clientSocket.emitWithAck("foo");
        assert.equal(result, "bar");
    });

    it("should work with waitFor()", () => {
        clientSocket.emit("baz");

        return waitFor(serverSocket, "baz");
    });*/
});
