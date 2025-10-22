// =================================================================
// Firebase Configuration
// =================================================================
// This file contains your Firebase project configuration.
// Replace these values with your actual Firebase project credentials.

// Your Firebase configuration object
// Get this from: Firebase Console > Project Settings > Your Apps > SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyBssT_CUa6OWf4D0xZqWNpO-q8ZzAT9bIE",
    authDomain: "solsrngweb.firebaseapp.com",
    databaseURL: "https://fdgwesdfwasfd-default-rtdb.firebaseio.com", // For Realtime Database
    projectId: "solsrngweb",
    storageBucket: "solsrngweb.firebasestorage.app",
    messagingSenderId: "1003350021295",
    appId: "1:1003350021295:web:0522505df1b47e8f74705a",
    measurementId: "G-CHSSZGTTJJ"
};

// Auto-initialize Firebase when this script loads
(function() {
    // Check if Firebase is available and config is set
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        try {
            // Initialize Firebase if not already initialized
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                console.log('✅ Firebase initialized successfully');
            }

            // Initialize Update System if available
            if (typeof window.updateSystem !== 'undefined') {
                window.updateSystem.initializeFirebase(firebaseConfig);
            }

            // Initialize Global Leaderboard if available
            if (typeof window.globalLeaderboard !== 'undefined') {
                window.globalLeaderboard.initializeFirebase(firebaseConfig);
            }

        } catch (error) {
            console.error('❌ Error initializing Firebase:', error);
        }
    } else {
        console.warn('⚠️ Firebase config not set up. Using placeholder values.');
        console.log('📝 To enable Firebase features:');
        console.log('   1. Go to https://console.firebase.google.com/');
        console.log('   2. Create or select your project');
        console.log('   3. Get your config from Project Settings');
        console.log('   4. Replace the values in firebase-config.js');
    }
})();

// Export config for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
