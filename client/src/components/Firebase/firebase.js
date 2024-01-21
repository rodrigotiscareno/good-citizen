import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { serverUrl } from "../../constants/constants";

// Keys have been rotated already.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function deleteUserAccount() {
  const user = auth.currentUser;
  return deleteUser(user);
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  const [userInformation, setUserInformation] = useState();
  const [userInformationFetched, setUserInformationFetched] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  useEffect(() => {
    if (currentUser && !userInformationFetched) {
      fetch(`${serverUrl}/api/getCurrentUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          var parsed = JSON.parse(data.response);
          setUserInformation(parsed[0]);
          setUserInformationFetched(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [currentUser, userInformationFetched]);

  return userInformation;
}
