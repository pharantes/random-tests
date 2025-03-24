const Kraken = require('kraken');
const krakenClient = new Kraken({
    api_key: process.env.KRAKEN_API_KEY,
    api_secret: process.env.KRAKEN_API_SECRET
});

exports.uploadImage = (filePath) => {
    return new Promise((resolve, reject) => {
        krakenClient.upload(filePath, {
            wait: true,
            resize: {
                width: 1200,
                height: 1200,
                strategy: 'auto'
            }
        }, (status) => {
            if (status.success) {
                resolve({
                    imageUrl: status.kraked_url,
                    originalSize: status.original_size,
                    optimizedSize: status.kraked_size
                });
            } else {
                reject(new Error(status.message));
            }
        });
    });
};