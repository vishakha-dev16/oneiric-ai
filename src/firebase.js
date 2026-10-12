import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBsdgM47XVlHwFkHcH5hAOE5r0Go1L7c0",
  authDomain: "oneiricai.firebaseapp.com",
  projectId: "oneiricai",
  storageBucket: "oneiricai.appspot.com",
  messagingSenderId: "885751623158",
  appId: "1:885751623158:web:a95581d6b073fcc01eabd7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
