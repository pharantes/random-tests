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

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/image-upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('Upload Error:', error);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Upload Failed:', error.message);
            return null;
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
        if (file) setPreview(URL.createObjectURL(file));
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
                accept="image/*"
                style={{ display: 'block', margin: '10px 0' }}
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    style={{
                        maxWidth: '200px',
                        height: 'auto',
                        marginTop: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
            )}
        </div>
    );
});

ImageUpload.displayName = 'ImageUpload';
export default ImageUpload;