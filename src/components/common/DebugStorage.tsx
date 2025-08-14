import React from 'react';


const DebugStorage: React.FC = () => {
  const checkLocalStorage = () => {
    console.log("🔍 === LOCALSTORAGE DEBUG ===");
    
    // Check what's in localStorage
    console.log("📦 All localStorage items:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key!);
      console.log(`  ${key}: ${value}`);
    }
    
    // Specifically check our items
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');
    
    console.log("🔑 AccessToken:", accessToken ? 'Found' : 'Not found');
    console.log("🔄 RefreshToken:", refreshToken ? 'Found' : 'Not found');
    console.log("👤 User data:", user ? 'Found' : 'Not found');
    
    if (user) {
      console.log("👤 Raw user data:", user);
      // Try to decrypt
      try {
        const CryptoJS = require('crypto-js');
        const decrypted = CryptoJS.AES.decrypt(user, 'secret-key').toString(CryptoJS.enc.Utf8);
        console.log("🔓 Decrypted:", decrypted);
        if (decrypted) {
          const parsed = JSON.parse(decrypted);
          console.log("📋 Parsed user:", parsed);
        }
      } catch (error) {
        console.log("❌ Decryption/Parse error:", error);
      }
    }
  };

  const clearAllData = () => {
    console.log("🗑️ Clearing all localStorage data...");
    localStorage.clear();
    console.log("✅ localStorage cleared");
  };

  const createTestUser = () => {
    console.log("🧪 Creating test user data...");
    const testUser = {
      userId: "test-123",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      role: "SUPER_ADMIN"
    };
    
    const CryptoJS = require('crypto-js');
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(testUser), 'secret-key').toString();
    localStorage.setItem('user', encrypted);
    localStorage.setItem('accessToken', 'test-token-123');
    
    console.log("✅ Test data created");
  };

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg z-50">
      <h3 className="text-lg font-bold text-red-600 mb-2">🔧 Debug Tools</h3>
      <div className="space-y-2">
        <button
          onClick={checkLocalStorage}
          className="block w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check localStorage
        </button>
        <button
          onClick={clearAllData}
          className="block w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Data
        </button>
        <button
          onClick={createTestUser}
          className="block w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Test User
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Check console for logs</p>
    </div>
  );
};

export default DebugStorage;