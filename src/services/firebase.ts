/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase Application
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services as per workspace requirements
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Critical constraint: Connection Validation test initially
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test_connection', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    } else {
      console.log("Firebase connection response received:", error);
    }
  }
}

testConnection();
