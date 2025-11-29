import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const AuthPage = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? (
        <Register setShowRegister={setShowRegister} />
      ) : (
        <Login setShowRegister={setShowRegister} />
      )}
    </>
  );
};

export default AuthPage;
