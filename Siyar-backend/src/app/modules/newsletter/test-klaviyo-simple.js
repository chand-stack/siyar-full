// Simple test to verify your Klaviyo API key works
// Replace YOUR_ACTUAL_API_KEY with the key you copied from Klaviyo dashboard

const axios = require('axios');

const KLAVIYO_LIST_ID = 'VQAAPh';
const KLAVIYO_PRIVATE_API_KEY = 'YOUR_ACTUAL_API_KEY'; // Replace this with your actual key

async function testKlaviyo() {
    console.log('🧪 Testing Klaviyo API...');
    console.log('List ID:', KLAVIYO_LIST_ID);
    console.log('API Key:', KLAVIYO_PRIVATE_API_KEY.substring(0, 10) + '...');
    
    try {
        // Test 1: Check if we can access the list
        console.log('\n📋 Step 1: Checking list access...');
        const listResponse = await axios.get(`https://a.klaviyo.com/api/v3/lists/${KLAVIYO_LIST_ID}/`, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ List found:', listResponse.data.data.attributes.name);
        
        // Test 2: Create a test profile
        console.log('\n👤 Step 2: Creating test profile...');
        const testEmail = `test-${Date.now()}@example.com`;
        const profileData = {
            type: "profile",
            attributes: {
                email: testEmail,
                first_name: "Test",
                last_name: "User",
                properties: {
                    $source: "api-test",
                    $consent: "email"
                }
            }
        };

        const profileResponse = await axios.post('https://a.klaviyo.com/api/v3/profiles/', {
            data: profileData
        }, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const profileId = profileResponse.data.data.id;
        console.log('✅ Profile created:', profileId);
        
        // Test 3: Add profile to your list
        console.log('\n📝 Step 3: Adding profile to list...');
        const listPayload = {
            data: [
                {
                    type: "profile",
                    id: profileId
                }
            ]
        };

        const listResponse2 = await axios.post(`https://a.klaviyo.com/api/v3/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, listPayload, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS! Profile added to list!');
        console.log('📧 Test email:', testEmail);
        console.log('🎉 Check your Klaviyo dashboard now - you should see this new member!');
        
    } catch (error) {
        console.log('❌ Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('🔑 API Key issue: Check if your API key is correct');
        } else if (error.response?.status === 404) {
            console.log('📋 List not found: Check if your List ID is correct');
        } else if (error.response?.status === 403) {
            console.log('🚫 Permission issue: Your API key might not have the right permissions');
        }
    }
}

testKlaviyo().catch(console.error);
