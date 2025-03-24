
export default function handler(req, res) {

  if (req.method === 'POST') {
    const { eventId } = req.query;
    const formData = req.body;
    console.log('Received form data for event', eventId);
    console.log('Form data:', formData);
    return res.status(200).json({ message: 'Form submitted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}