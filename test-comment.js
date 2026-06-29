const API_URL = 'https://civicvoice-api-g6ws.onrender.com/api/v1';

async function test() {
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'arjun@example.com', password: 'password' })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    return;
  }
  
  const body = await loginRes.json();
  console.log('Login Response:', body);
  const token = body.accessToken;
  
  const issueId = '4326b480-bba5-41c6-96db-5126d9c8cc95';
  
  const res = await fetch(`${API_URL}/issues/${issueId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content: 'Hello World' })
  });
  
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}

test();
