import {
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
    useCallback,
    useEffect
} from 'react';

const ImageUpload = forwardRef(({ label }, ref) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleUpload = useCallback(async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return null;

        console.log('Selected file:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/image-upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Image upload failed');
            }

            if (!result.imageUrl) {
                throw new Error('Server error: No image URL returned');
            }

            return result;

        } catch (error) {
            console.error('Upload Failed:', {
                message: error.message,
                ...(error.details && { details: error.details })
            });
            throw error;
        }
    }, []);

    const clearFile = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            setPreview(null);
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    useImperativeHandle(ref, () => ({
        uploadImage: handleUpload,
        clearFile
    }), [handleUpload, clearFile]);

    return (
        <div>
            <label>{label}</label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
                multiple
                aria-label="Select an image file (JPEG or PNG)"
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    style={{
                        maxWidth: '200px',
                        height: 'auto',
                        marginTop: '10px',
                        borderRadius: '4px'
                    }}
                    loading="lazy"
                />
            )}
        </div>
    );
});

ImageUpload.displayName = 'ImageUpload';
export default ImageUpload;