export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { eventId } = req.query;
      const data = req.body;

      console.log('Received submission for event:', eventId);
      console.log('Submission data:', JSON.stringify(data, null, 2));
      console.log('Image URL:', data.imageUrl || 'null');

      return res.status(200).json({
        success: true,
        eventId,
        receivedData: data,
      });
    } catch (error) {
      console.error('Storage Error:', error);
      return res.status(500).json({
        error: error.message || 'Server error'
      });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}