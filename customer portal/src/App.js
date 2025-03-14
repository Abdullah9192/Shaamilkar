import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import routes from "./Routes";
import { Suspense, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { ToastContainer } from "react-toastify";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn"));
  useEffect(() => {
    if (!loggedIn || loggedIn === false) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="App">
      <Suspense fallback={<span className="loader"></span>}>
        <Routes>
          {routes.map((route, index) => (
            <Route path={route.path} element={route.element} key={index} />
          ))}
        </Routes>
      </Suspense>
      <ToastContainer />
    </div>
  );
}

export default App;
