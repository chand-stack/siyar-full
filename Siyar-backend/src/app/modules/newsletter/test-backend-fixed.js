// Test your backend with the correct List ID
const axios = require('axios');

const BACKEND_URL = 'https://siyar-backend.vercel.app';

async function testBackendFixed() {
    console.log('🧪 Testing your backend with fixed Klaviyo integration...');
    
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

testBackendFixed().catch(console.error);
