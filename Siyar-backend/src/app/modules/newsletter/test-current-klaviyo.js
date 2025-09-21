// Test current Klaviyo API v3 endpoints
const axios = require('axios');

const KLAVIYO_PRIVATE_API_KEY = 'pk_22d815e26ba048dcde20008844122a8166';

async function testCurrentKlaviyo() {
    console.log('🧪 Testing current Klaviyo API v3...');
    console.log('API Key:', KLAVIYO_PRIVATE_API_KEY.substring(0, 10) + '...');
    
    try {
        // Test 1: Get account info to verify API key works
        console.log('\n📋 Step 1: Testing API key with account info...');
        const accountResponse = await axios.get('https://a.klaviyo.com/api/accounts/', {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ API key works! Account:', accountResponse.data.data[0].attributes.name);
        
        // Test 2: Get all lists
        console.log('\n📋 Step 2: Getting all lists...');
        const listsResponse = await axios.get('https://a.klaviyo.com/api/lists/', {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
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
        
        // Test 3: Create a test profile
        console.log('\n👤 Step 3: Creating test profile...');
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
                'Content-Type': 'application/json'
            }
        });

        const profileId = profileResponse.data.data.id;
        console.log('✅ Profile created:', profileId);
        
        // Test 4: Add profile to the first list
        const firstList = listsResponse.data.data[0];
        console.log(`\n📝 Step 4: Adding profile to list "${firstList.attributes.name}"...`);
        
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
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ SUCCESS! Profile added to list!');
        console.log('📧 Test email:', testEmail);
        console.log('📋 List ID to use:', firstList.id);
        console.log('🎉 Check your Klaviyo dashboard now - you should see this new member!');
        
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

testCurrentKlaviyo().catch(console.error);
