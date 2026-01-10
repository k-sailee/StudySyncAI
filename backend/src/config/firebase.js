import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase Admin SDK
// In production, you would use a service account key file
// For development, we'll use the project ID from environment variables

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "studysync-demo",
};

// Prefer explicit service account JSON stored in env
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    let serviceAccount = null;
    try {
      serviceAccount = JSON.parse(raw);
    } catch (err) {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is present but not valid JSON. Falling back to other credential methods.", err.message);
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: firebaseConfig.projectId,
      });
      console.log("Firebase Admin initialized via FIREBASE_SERVICE_ACCOUNT_KEY");
    }
  } catch (err) {
    // Any unexpected error here should be logged but we don't want to crash on parse issues
    console.error("Error while processing FIREBASE_SERVICE_ACCOUNT_KEY:", err);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // If GOOGLE_APPLICATION_CREDENTIALS is set, load the file directly
  try {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS.startsWith("/")
      ? process.env.GOOGLE_APPLICATION_CREDENTIALS
      : path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    if (fs.existsSync(credPath)) {
      try {
        const raw = fs.readFileSync(credPath, "utf8");
        console.log(`Read ${raw.length} bytes from ${credPath}`);
        console.log(`Preview: ${raw.slice(0,120).replace(/\n/g, "\\n").slice(0,120)}`);
        const serviceAccount = JSON.parse(raw);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: firebaseConfig.projectId,
        });
        console.log(`Firebase Admin initialized via GOOGLE_APPLICATION_CREDENTIALS: ${credPath}`);
      } catch (err) {
        console.warn(`Failed to parse JSON at ${credPath}. Falling back to repository serviceAccountKey.json if present.`, err.message);
        // try fallback local file in repo root
        const localFallback = path.resolve(__dirname, "../../serviceAccountKey.json");
        if (fs.existsSync(localFallback)) {
          try {
            const rawLocal = fs.readFileSync(localFallback, "utf8");
            console.log(`Read ${rawLocal.length} bytes from ${localFallback}`);
            console.log(`Local preview: ${rawLocal.slice(0,120).replace(/\n/g, "\\n").slice(0,120)}`);
            const serviceAccountLocal = JSON.parse(rawLocal);
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccountLocal),
              projectId: firebaseConfig.projectId,
            });
            console.log(`Firebase Admin initialized via local fallback: ${localFallback}`);
          } catch (err2) {
            console.error(`Local fallback ${localFallback} also failed to parse:`, err2.message);
            throw err2;
          }
        } else {
          throw err;
        }
      }
    } else {
      throw new Error(`Service account file not found: ${credPath}`);
    }
  } catch (err) {
    console.error("Failed to initialize via GOOGLE_APPLICATION_CREDENTIALS:", err);
    throw err;
  }
} else if (process.env.FIRESTORE_EMULATOR_HOST) {
  // If using the Firestore emulator, initialize without credentials
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
  console.log("Firebase Admin initialized for Firestore emulator (no credentials)");
} else {
  // Last resort: attempt application default; this will succeed if running in GCP or if
  // GOOGLE_APPLICATION_CREDENTIALS is set in the environment of the process runner.
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId,
    });
    console.log("Firebase Admin initialized via applicationDefault (fallback)");
  } catch (err) {
    console.error(
      "No Firebase credentials available. Set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS.\n",
      err
    );
    // Re-throw so the server fails fast and logs the clear error
    throw err;
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
