"use client";

export default function TestPage() {
  const testRegister = async () => {
    console.log('Starting test registration');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass123',
          email: 'test@example.com'
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  return (
    <div className="p-4">
      <h1>API Test Page</h1>
      <button 
        onClick={testRegister}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Register API
      </button>
    </div>
  );
} 