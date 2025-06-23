import { initializeApp, credential as _credential, auth } from 'firebase-admin';
import serviceAccount from './service-accountkey.json';

initializeApp({
  credential: _credential.cert(serviceAccount),
});

if (process.argv.length !== 3) {
  console.error('Usage: node makeAdmin.js <USER_UID>');
  process.exit(1);
}

const uid = process.argv[2];

auth()
  .setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`✅ User ${uid} is now admin`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
