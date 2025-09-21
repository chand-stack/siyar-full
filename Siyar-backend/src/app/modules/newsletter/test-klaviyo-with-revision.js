// Test Klaviyo API v3 with proper REVISION header
const axios = require('axios');

const KLAVIYO_PRIVATE_API_KEY = 'pk_22d815e26ba048dcde20008844122a8166';
const KLAVIYO_REVISION = '2024-10-15'; // Current API revision

async function testKlaviyoWithRevision() {
    console.log('🧪 Testing Klaviyo API v3 with REVISION header...');
    console.log('API Key:', KLAVIYO_PRIVATE_API_KEY.substring(0, 10) + '...');
    console.log('Revision:', KLAVIYO_REVISION);
    
    try {
        // Test 1: Get all lists
        console.log('\n📋 Step 1: Getting all lists...');
        const listsResponse = await axios.get('https://a.klaviyo.com/api/lists/', {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'revision': KLAVIYO_REVISION,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Lists found:', listsResponse.data.data.length);
        listsResponse.data.data.forEach((list, index) => {
            console.log(`\n${index + 1}. List Name: "${list.attributes.name}"`);
            console.log(`   List ID: ${list.id}`);
            console.log(`   Created: ${list.attributes.created}`);
        });
        
        if (listsResponse.data.data.length === 0) {
            console.log('\n❌ No lists found! You need to create a list first.');
            console.log('\n📝 To create a list:');
            console.log('1. Go to your Klaviyo dashboard');
            console.log('2. Navigate to Audience → Lists & segments');
            console.log('3. Click "Create List"');
            console.log('4. Name it "Siyar Newsletter" or similar');
            console.log('5. Get the List ID from the URL');
            return;
        }
        
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

        const profileResponse = await axios.post('https://a.klaviyo.com/api/profiles/', {
            data: profileData
        }, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'revision': KLAVIYO_REVISION,
                'Content-Type': 'application/json'
            }
        });

        const profileId = profileResponse.data.data.id;
        console.log('✅ Profile created:', profileId);
        
        // Test 3: Add profile to the first list
        const firstList = listsResponse.data.data[0];
        console.log(`\n📝 Step 3: Adding profile to list "${firstList.attributes.name}"...`);
        
        const listPayload = {
            data: [
                {
                    type: "profile",
                    id: profileId
                }
            ]
        };

        const listResponse = await axios.post(`https://a.klaviyo.com/api/lists/${firstList.id}/relationships/profiles/`, listPayload, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'revision': KLAVIYO_REVISION,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS! Profile added to list!');
        console.log('📧 Test email:', testEmail);
        console.log('📋 List ID to use:', firstList.id);
        console.log('🎉 Check your Klaviyo dashboard now - you should see this new member!');
        
        console.log('\n🔧 Update your .env file with:');
        console.log(`KLAVIYO_LIST_ID=${firstList.id}`);
        console.log(`KLAVIYO_PRIVATE_API_KEY=${KLAVIYO_PRIVATE_API_KEY}`);
        
    } catch (error) {
        console.log('❌ Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('🔑 API Key issue: Your API key might be incorrect or expired');
        } else if (error.response?.status === 403) {
            console.log('🚫 Permission issue: Your API key might not have the right permissions');
        } else if (error.response?.status === 404) {
            console.log('📋 Endpoint not found: The API endpoint might be incorrect');
        }
    }
}

testKlaviyoWithRevision().catch(console.error);
