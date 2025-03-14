import React, { useState, useEffect, useRef } from "react";
import LogoImg from "../../assets/NavLOGO.jpeg";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa6";
import { GrPlan } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const iconRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    navigate("/user-profile");
  };

  const handleApplicationClick = () => {
    setIsProfileMenuOpen(false);
    navigate("/application-history");
  };

  const handleInstallmentClick = () => {
    setIsProfileMenuOpen(false);
    navigate("/installmentPlan");
  };

  useEffect(() => {
    const handleInteraction = (event) => {
      if (
        !menuRef.current?.contains(event.target) &&
        !iconRef.current?.contains(event.target)
      )
        setIsProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    return () => {
      document.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("selectedproduct");
    localStorage.removeItem("installmentPlan");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("products");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg  navbar-light bg-white border-bottom px-4">
      <div className="d-flex align-items-center">
        <img
          src={LogoImg}
          alt="logo"
          style={{
            width: "200px",
            aspectRatio: "auto 100 / 50",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href = "/";
          }}
        />
      </div>
      <div className="d-flex align-items-center ms-auto position-relative">
        <span
          style={{ cursor: "pointer" }}
          ref={iconRef}
          onClick={toggleProfileMenu}
        >
          <FaUserCircle
            style={{ color: "#90C997", width: "40px", height: "40px" }}
          />
        </span>

        {isProfileMenuOpen && (
          <div
            ref={menuRef}
            className="dropdown-menu-none show position-absolute"
            style={{
              right: 0,
              top: "45px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              zIndex: 1000,
              width: "230px",
            }}
          >
            <div>
              <div
                className="d-flex p-2"
                style={{
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "100%",
                }}
              >
                <FaUserCircle
                  style={{
                    color: "var(--darkgreen)",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                  }}
                />
                <p
                  className="fs-5 px-2 fw-bold"
                  style={{
                    margin: 0,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    color: "var(--darkgreen)",
                  }}
                >
                  {JSON.parse(localStorage.getItem("user")).name}
                </p>
              </div>
              <button
                className="dropdown-item"
                style={{
                  cursor: "pointer",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={handleProfileClick}
              >
                <FaUser style={{ color: "var(--darkgreen)" }} />
                Profile
              </button>
              <button
                className="dropdown-item"
                style={{
                  cursor: "pointer",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={handleApplicationClick}
              >
                <FaWpforms
                  style={{ fontSize: "18px", color: "var(--darkgreen)" }}
                />
                Application History
              </button>
              <button
                className="dropdown-item"
                style={{
                  cursor: "pointer",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={handleInstallmentClick}
              >
                <GrPlan
                  style={{ fontSize: "18px", color: "var(--darkgreen)" }}
                />
                Installment Plan
              </button>
              <button
                className="dropdown-item"
                style={{
                  cursor: "pointer",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={handleLogoutClick}
              >
                <FaSignOutAlt style={{ color: "var(--darkgreen)" }} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
