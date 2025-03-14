import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsData } from "../ProductsData";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductDescription from "./ProductDescription";
import Navbar from "../../../Components/Navbar/Navbar";
import { FaStoreAlt } from "react-icons/fa";

const ProductDetails1 = () => {
  const navigate = useNavigate();
  const { id } = 2;
  const product = productsData.find((item) => item.id === parseInt(id));

  const [mainImage, setMainImage] = useState(product?.imageURL);

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleApplication = () => {
    navigate("/application");
  };

  if (!product) {
    return (
      <div className="container my-4">
        <h2 className="text-center">Product Not Found</h2>
        <p className="text-center">
          Couldn't find the product you're looking for. <br /> Please try
          selecting the product from <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            // href="https://shaamilkar.myshopify.com"
          >
            Shaamilkar.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container p-5">
        <div className="row g-5 mb-5">
          <div className="col-md-5">
            <div
              className="d-flex justify-content-center align-items-center bg-white p-2"
              style={{
                borderRadius: "10px",
                width: "100%",
                height: "90%",
                maxHeight: "400px",
              }}
            >
              <img
                src={mainImage}
                alt={product.name}
                className="img-fluid rounded"
                style={{
                  width: "60%",
                  height: "80%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              />
            </div>
          </div>

          <div className="col-md-7">
            <h2>{product.name}</h2>
            <div className="mb-4">
              <h6>Color:</h6>
              <div className="d-flex gap-2 mt-2">
                {product.colors?.map((color, index) => (
                  <span
                    key={index}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: color,
                      borderRadius: "20%",
                      border: "2px solid #ccc",
                      cursor: "pointer",
                    }}
                  ></span>
                ))}
              </div>
            </div>

            <h2 className="text-success my-4">{product.price}</h2>
            <div className="my-3">
              <div className="d-flex gap-2">
                {[3, 6, 12, 18].map((months) => (
                  <button
                    key={months}
                    className="btn btn-outline-success"
                    style={{
                      minWidth: "50px",
                      padding: "5px 10px",
                    }}
                  >
                    {months} Months
                  </button>
                ))}
              </div>
              <h6 className="mt-3">
                Monthly Installment: {product.installment}
              </h6>
            </div>

            <div className="d-flex gap-4 mt-4">
              <button className="btn button w-50" onClick={handleApplication}>
                Buy Now
              </button>
              <button
                className="btn btn-outline-success w-50"
                onClick={handleApplication}
              >
                Buy On Installments
              </button>
            </div>

            <p className="text-muted mt-4 ms-1">
              <FaStoreAlt className="me-2" /> Device{" "}
              <span className="ms-2 fw-bold">{product.device}</span>
            </p>
          </div>
          <div className="d-flex justify-content-start gap-4 mt-1 col-md-5">
            {product.imageGallery?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product.name}
                className="img-thumbnail img-fluid rounded category-item"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>

        <div className="">
          <ProductDescription />
        </div>
      </div>
    </>
  );
};

export default ProductDetails1;
