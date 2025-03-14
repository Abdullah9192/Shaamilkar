import Home from "./Pages/Home";
import Register from "./Pages/Auth/Register";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import LoginPage from "./Pages/Auth/Login";
import ApplicationForm from "./Pages/ApplicationForm/ApplicationForm";
import ProductDetails from "./Pages/Products/ProductDetails/ProductDetails";
import ApplicationRequests from "./Pages/ApplicationRequests";
import UserProfile from "./Pages/Auth/UserProfile";
import InstallmentPlan from "./Pages/InstallmentPlan/InstallmentPlan";

const routes = [
  {
    name: "Home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "Login",
    path: "/login",
    element: <LoginPage />,
  },
  {
    name: "Register",
    path: "/register",
    element: <Register />,
  },
  {
    name: "Forget Password",
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    name: "Profile",
    path: "/user-profile",
    element: <UserProfile />,
  },
  {
    name: "Product Details",
    path: "/productDetails/:id",
    element: <ProductDetails />,
  },
  {
    name: "Application Form",
    path: "/",
    element: <ApplicationForm />,
  },
  {
    name: "Application History",
    path: "/application-history",
    element: <ApplicationRequests />,
  },
  {
    name: "Installment Plan",
    path: "/installmentPlan",
   element:<InstallmentPlan/>
  },
];
export default routes;
