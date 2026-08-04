import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserRoutes from "../routes/UserRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <UserRoutes />
    </BrowserRouter>
  );
}

export default App;
