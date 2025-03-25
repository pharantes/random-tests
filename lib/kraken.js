const Kraken = require('kraken');
const fs = require('fs');

const krakenClient = new Kraken({
    api_key: process.env.KRAKEN_API_KEY,
    api_secret: process.env.KRAKEN_API_SECRET
});

exports.uploadImage = async (filePath) => {
    try {
        // Normalize Windows paths
        const normalizedPath = filePath.replace(/\\/g, '/');
        console.log('[Kraken] Processing:', normalizedPath);

        return new Promise((resolve, reject) => {
            const fileStream = fs.createReadStream(normalizedPath);

            const params = {
                file: fileStream,
                wait: true,
                resize: {
                    width: 100,
                    height: 75,
                    strategy: "crop"
                },
                s3_store: {
                    key: process.env.AMAZON_ACCESS_KEY,
                    secret: process.env.AMAZON_SECRET_KEY,
                    bucket: "assets",
                    path: "images/layout/header.jpg"
                },
                webp: true,
                lossy: true
            };

            krakenClient.upload(params, (status) => {
                console.log('[Kraken] Full Response:', JSON.stringify(status, null, 2));

                if (!status) {
                    return reject(new Error('Empty response from Kraken API'));
                }

                if (status.success) {
                    if (!status.kraked_url) {
                        return reject(new Error('Kraken succeeded but returned no URL'));
                    }
                    resolve({
                        imageUrl: status.kraked_url,
                        originalSize: status.original_size,
                        optimizedSize: status.kraked_size
                    });
                } else {
                    const errorMessage = status.message || `Kraken Error ${status.status_code || 'unknown'}`;
                    reject(new Error(errorMessage));
                }
            });
        });
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
};