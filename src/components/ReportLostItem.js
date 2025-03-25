import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import ImageUpload from './ImageUpload';

const ITEM_TYPES = ['phone', 'keys', 'bag', 'jacket', 'wallet', 'laptop', 'documents'];

const ReportLostItem = function () {
    const router = useRouter();
    const { eventId } = router.query;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageUploadRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log('Form Data Before Submit:', data);

            const imageResult = await imageUploadRef.current?.uploadImage();
            console.log('Image Upload Result:', imageResult || 'No image result');

            const payload = {
                ...data,
                imageUrl: imageResult?.imageUrl || null
            };
            console.log('Final Payload:', payload);

            const response = await fetch(`/api`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Submission failed');
            }

            const result = await response.json();
            console.log('API Response:', result);

            e.target.reset();
            imageUploadRef.current.clearFile();
            alert('Item reported successfully!');
        } catch (error) {
            console.error('Submission Error:', error);
            alert(error.message || 'Error submitting form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Report Lost Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Type *</label>
                    <select name="itemType" required>
                        <option value="">Select an item type</option>
                        {ITEM_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Brand</label>
                    <input type="text" name="brand" />
                </div>

                <div>
                    <label>Color</label>
                    <input type="text" name="color" />
                </div>

                <div>
                    <label>Notes</label>
                    <textarea name="notes" rows="4" />
                </div>

                <div>
                    <ImageUpload ref={imageUploadRef} label="Upload Item Photo" />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default ReportLostItem;