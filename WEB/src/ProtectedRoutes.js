import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "./context/userSession.context";

const ProtectedRoute = ({ children }) => {
  const session = useContext(SessionContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div class="container text-center">
        <div class="alert alert-primary m-3" role="alert">
          Please
          <Link to='/signin' type="button" className="btn btn-primary m-3">Sign in</Link>
          to continue.
        </div>
        
      </div>
      );
      
  }

  return children;
};

export default ProtectedRoute;
