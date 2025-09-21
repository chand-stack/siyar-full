// Find all your Klaviyo lists to get the correct List ID
const axios = require('axios');

const KLAVIYO_PRIVATE_API_KEY = 'pk_22d815e26ba048dcde20008844122a8166';

async function findYourLists() {
    console.log('🔍 Finding all your Klaviyo lists...');
    console.log('API Key:', KLAVIYO_PRIVATE_API_KEY.substring(0, 10) + '...');
    
    try {
        // Get all lists
        const response = await axios.get('https://a.klaviyo.com/api/v3/lists/', {
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('\n📋 Your Klaviyo Lists:');
        console.log('====================');
        
        if (response.data.data.length === 0) {
            console.log('❌ No lists found! You need to create a list first.');
            console.log('\n📝 To create a list:');
            console.log('1. Go to your Klaviyo dashboard');
            console.log('2. Navigate to Audience → Lists & segments');
            console.log('3. Click "Create List"');
            console.log('4. Name it "Siyar Newsletter" or similar');
            console.log('5. Get the List ID from the URL');
        } else {
            response.data.data.forEach((list, index) => {
                console.log(`\n${index + 1}. List Name: "${list.attributes.name}"`);
                console.log(`   List ID: ${list.id}`);
                console.log(`   Created: ${list.attributes.created}`);
                console.log(`   Updated: ${list.attributes.updated}`);
            });
            
            console.log('\n✅ Use one of these List IDs in your .env file:');
            console.log('KLAVIYO_LIST_ID=YOUR_CHOSEN_LIST_ID_HERE');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log('🔑 API Key issue: Your API key might be incorrect or expired');
        } else if (error.response?.status === 403) {
            console.log('🚫 Permission issue: Your API key might not have the right permissions');
        }
    }
}

findYourLists().catch(console.error);
