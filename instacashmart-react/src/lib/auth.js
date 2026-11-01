import { useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function useFirebaseUser() {
  const [user, setUser] = useState(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthReady(true);
      }),
    [],
  );

  return { user, authReady };
}

export async function signInWithGoogle() {
  const currentUser = auth.currentUser;
  if (isGoogleUser(currentUser)) {
    return currentUser;
  }
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export function isGoogleUser(user) {
  return !!user?.providerData.some((provider) => provider.providerId === "google.com");
}

export function signOutUser() {
  return signOut(auth);
}
