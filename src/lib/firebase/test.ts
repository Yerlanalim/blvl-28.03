/**
 * @file test.ts
 * @description Test file to verify Firebase initialization
 * This file is for testing purposes only and should not be used in production
 */

import { auth, db, storage } from './config';

// Check that Firebase services are initialized
const testFirebaseInitialization = () => {
  console.log('Firebase Auth initialized:', auth !== null);
  console.log('Firebase Firestore initialized:', db !== null);
  console.log('Firebase Storage initialized:', storage !== null);
  
  return {
    auth: auth !== null,
    db: db !== null, 
    storage: storage !== null
  };
};

export default testFirebaseInitialization; 