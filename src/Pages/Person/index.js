import React, { useState, useEffect } from "react";
import { auth } from "../Config/Config";
import { getDatabase, ref, get } from "firebase/database"; // Import Realtime Database functions

export default function Person() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setUser(user);

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      
      // Fetch user data from the Realtime Database
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFullName(userData.fullName);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  return (
    <div className="user-info-container">
      {user && (
        <div>
          <h1>Welcome, {fullName}</h1>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}
