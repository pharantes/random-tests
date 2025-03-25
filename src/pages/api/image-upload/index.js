import { IncomingForm } from 'formidable';
import { uploadImage } from '../../../../lib/kraken';

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let uploadedFile;
    try {
        const form = new IncomingForm({
            keepExtensions: true,
            multiples: false
        });

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve([
                    fields,
                    { image: files.image ? [files.image] : [] }
                ]);
            });
        });

        if (!files.image?.length || !files.image[0]?.filepath) {
            return res.status(400).json({ error: 'No valid file uploaded' });
        }

        uploadedFile = files.image[0];
        console.log('File upload details:', {
            path: uploadedFile.filepath,
            name: uploadedFile.originalFilename,
            size: uploadedFile.size,
            type: uploadedFile.mimetype
        });

        const result = await uploadImage(uploadedFile.filepath);

        if (!result?.imageUrl) {
            throw new Error('Image processing failed - no URL returned');
        }

        return res.status(200).json(result);

    } catch (error) {

        console.error('Image Upload Error:', {
            message: error.message,
            stack: error.stack,
            file: uploadedFile?.filepath
        });

        return res.status(500).json({
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && {
                details: {
                    stack: error.stack,
                    filePath: uploadedFile?.filepath,
                    credentialsConfigured: !!process.env.KRAKEN_API_KEY
                }
            })
        });
    }
}