import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ConstellationAnimation } from "./LoginAnimation";

const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    setAuthing(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      console.log("User UID:", response.user.uid);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setAuthing(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left half — constellation animation */}
      <ConstellationAnimation />

      {/* Right half — login */}
      <div className="w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-10 text-white">
            <h4 className="text-4xl font-bold mb-2">
              Welcome to the New Era University Library.
            </h4>
            <p className="text-lg mb-4">Sign in with your university account.</p>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button
            className="w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer disabled:opacity-50"
            onClick={signInWithGoogle}
            disabled={authing}
          >
            {authing ? "Signing in…" : "Log In With University Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;