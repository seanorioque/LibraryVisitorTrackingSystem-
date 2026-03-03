import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
function App() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <h1>Hello Laizaa!</h1>
      <button onClick={handleLogout} className="rounded-full">
        Logout
      </button>
    </div>
  );
}

export default App;