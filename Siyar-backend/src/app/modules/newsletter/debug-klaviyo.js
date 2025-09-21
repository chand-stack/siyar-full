// Debug script to test Klaviyo API directly
// Run this with: node debug-klaviyo.js

const axios = require('axios');

const KLAVIYO_LIST_ID = 'VQAAPh';
const KLAVIYO_PRIVATE_API_KEY = 'pk_22d815e26ba048dcde20008844122a8166';

async function testKlaviyoAPI() {
    console.log('🔍 Testing Klaviyo API...');
    console.log('List ID:', KLAVIYO_LIST_ID);
    console.log('API Key:', KLAVIYO_PRIVATE_API_KEY.substring(0, 10) + '...');
    
    // Test 1: Check if list exists
    console.log('\n📋 Test 1: Checking if list exists...');
    try {
        const listResponse = await axios.get(`https://a.klaviyo.com/api/v3/lists/${KLAVIYO_LIST_ID}/`, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ List exists:', listResponse.data.data.attributes.name);
    } catch (error) {
        console.log('❌ List check failed:', error.response?.data || error.message);
    }

    // Test 2: Try API v3 profile creation
    console.log('\n👤 Test 2: Creating profile with API v3...');
    try {
        const profileData = {
            type: "profile",
            attributes: {
                email: "test@example.com",
                first_name: "Test",
                last_name: "User",
                properties: {
                    $source: "debug-test",
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

        console.log('✅ Profile created:', profileResponse.data.data.id);
        
        // Test 3: Add profile to list
        console.log('\n📝 Test 3: Adding profile to list...');
        const listPayload = {
            data: [
                {
                    type: "profile",
                    id: profileResponse.data.data.id
                }
            ]
        };

        const listResponse = await axios.post(`https://a.klaviyo.com/api/v3/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, listPayload, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Profile added to list successfully!');
        console.log('Response:', listResponse.data);

    } catch (error) {
        console.log('❌ API v3 failed:', error.response?.data || error.message);
        
        // Test 4: Try API v2 as fallback
        console.log('\n🔄 Test 4: Trying API v2 as fallback...');
        try {
            const v2Payload = {
                profiles: [
                    {
                        email: "test-v2@example.com",
                        first_name: "Test",
                        last_name: "User V2",
                        $source: "debug-test-v2",
                        $consent: "email"
                    }
                ]
            };

            const v2Response = await axios.post(`https://a.klaviyo.com/api/v2/list/${KLAVIYO_LIST_ID}/subscribe`, v2Payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: { api_key: KLAVIYO_PRIVATE_API_KEY }
            });

            console.log('✅ API v2 success:', v2Response.data);
        } catch (v2Error) {
            console.log('❌ API v2 also failed:', v2Error.response?.data || v2Error.message);
        }
    }

    // Test 5: Check current list members
    console.log('\n📊 Test 5: Checking current list members...');
    try {
        const membersResponse = await axios.get(`https://a.klaviyo.com/api/v3/lists/${KLAVIYO_LIST_ID}/profiles/`, {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Current members count:', membersResponse.data.data.length);
        membersResponse.data.data.forEach((member, index) => {
            console.log(`  ${index + 1}. ${member.attributes.email} (${member.attributes.first_name} ${member.attributes.last_name})`);
        });
    } catch (error) {
        console.log('❌ Failed to get members:', error.response?.data || error.message);
    }
}

testKlaviyoAPI().catch(console.error);
