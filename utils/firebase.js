// Convenience re-export of app + auth + db. Only import this from routes that need everything
// (create / edit). Public pages use the split modules so they don't pull the whole SDK.
import app from './firebaseApp';
export { auth } from './firebaseAuth';
export { db } from './firebaseDb';
export default app;
