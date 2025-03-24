// pages/api/image-upload.js
import { IncomingForm } from 'formidable';
import { uploadImage } from '../../../../lib/kraken';

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = new IncomingForm();
        form.maxFileSize = 5 * 1024 * 1024; // 5MB
        form.keepExtensions = true;

        const [_, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        console.log('Received upload request with files:', files);

        if (!files.image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const result = await uploadImage(files.image.filepath);
        console.log('Kraken upload result:', result);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Image Upload API Error:', error);
        return res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}