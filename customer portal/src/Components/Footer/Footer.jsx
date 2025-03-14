import FootorLogo from "../../assets/bottom.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{ height: "50px", backgroundColor: "var(--btncolor)" }}
    >
      <div className="container-fluid h-100 d-flex justify-content-between align-items-center">
        <div>
          <img
            src={FootorLogo}
            alt="logo"
            className="footer-logo"
            style={{
              width: "180px",
              aspectRatio: "auto 100 / 50",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div className="footer-text d-none d-md-block d-lg-block">
          <span className="text-light me-1">
            <strong>©</strong> 2025 - shamilkar- all rights reserved.
          </span>
        </div>
        <div className="text-end footer-text">
          <span className="text-light me-1">Powered by</span>
          <a
            href="https://shaamilkar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-bold footer-link"
            style={{ color: "var(--darkgreen)", textDecoration: "none" }}
          >
            Shamilkar
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
