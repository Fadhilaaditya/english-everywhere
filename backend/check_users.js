const axios = require('axios');

async function test() {
    try {
        // Need to login first to get a token
        const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
            username: 'admin',
            password: 'password123' // hope this works or whatever they use
        });
        
        const token = loginRes.data.accessToken;
        console.log('Login successful');
        
        const res = await axios.get('http://localhost:3001/api/users?page=1&limit=10', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Response Keys:', Object.keys(res.data));
        console.log('Total Items:', res.data.totalItems);
        console.log('Users Length:', res.data.users ? res.data.users.length : 'N/A');
        console.log('Total Pages:', res.data.totalPages);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

test();
