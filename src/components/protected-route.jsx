import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

function ProtectedRoute({ allowedRoles }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.data()?.role;
        setAuthorized(allowedRoles.includes(role));
      } else {
        setAuthorized(false);
      }
    });
    return unsubscribe;
  }, [allowedRoles]);

  if (authorized === null) return <p>Checking permissions...</p>;
  if (!authorized) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
