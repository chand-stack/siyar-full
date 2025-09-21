// Test your actual backend newsletter endpoint
const axios = require('axios');

const BACKEND_URL = 'https://siyar-backend.vercel.app'; // Your actual backend URL

async function testBackend() {
    console.log('🧪 Testing your backend newsletter endpoint...');
    
    const testEmail = `backend-test-${Date.now()}@example.com`;
    
    try {
        const response = await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, {
            email: testEmail,
            firstName: "Backend",
            lastName: "Test",
            source: "api-test"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Backend response:', response.data);
        console.log('📧 Test email:', testEmail);
        console.log('🎉 Check your Klaviyo dashboard for this email!');
        
    } catch (error) {
        console.log('❌ Backend error:', error.response?.data || error.message);
    }
}

testBackend().catch(console.error);
