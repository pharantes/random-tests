import { useState } from 'react';
import { useRouter } from 'next/router';
const itemTypes = ['phone', 'keys', 'bag', 'jacket', 'wallet', 'laptop', 'documents'];

const ReportLostItem = () => {
    const router = useRouter();
    const { eventId } = router.query;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            // we have to pass the real route and event id here
            const response = await fetch(`/api`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Submission failed');
            e.target.reset();
            alert('Item reported successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting form');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Report Lost Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Item Type *
                    </label>
                    <select
                        name="itemType"
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value="">Select an item type</option>
                        {itemTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <input
                        type="text"
                        name="color"
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                        name="notes"
                        className="w-full p-2 border rounded-md h-24"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    )
};
export default ReportLostItem;