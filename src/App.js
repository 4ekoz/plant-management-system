import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Importing components
import Layout from "./Components/Layout/Layout";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Forgotpassword from "./Components/Forgotpassword/Forgotpassword";
import VerifyCode from "./Components/Verifycode/Verifycode";
import Resetpassword from "./Components/Resetpassword/Resetpassword";
import VerifyEmail from "./Components/VerifyEmail/VerifyEmail";
import Notfound from "./Components/Notfound/Notfound";
import ProtectedRoute from "./Components/Protectroute/Protectroute";
import Dashboard from "./Components/Dashboard/Dashboard";
import Settings from './Components/Settings/Settings';
import PlantPage from './Components/plant/plant';
import AddPlant from "./Components/Add-plant/Add-plant";
import UpdatePlant from "./Components/UpdatePlant/UpdatePlant";

// 🔑 معرف العميل من Google Cloud Console
const clientId = "216879394932-cg3plgmhph894rsls1ruarb4r4uh47dp.apps.googleusercontent.com";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <Forgotpassword /> },
      { path: "resetpassword", element: <Resetpassword /> },
      { path: "verify-email/:token", element: <VerifyEmail /> },
      { path: "verifycode", element: <VerifyCode /> },
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
        children: [
          { index: true, element: <AddPlant /> },
          { path: "add-plant", element: <AddPlant /> },
          { path: "settings", element: <Settings /> },
          { path: "plant", element: <PlantPage /> },
          { path: "update-plant/:id", element: <UpdatePlant /> }
        ]
      },
      { path: "*", element: <Notfound /> }
    ]
  }
]);

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;
