import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "../../BASE_URL";
import img from "../../assets/infinix-note-12.png";
import { toast } from "react-toastify";
import { installmentPlan } from "../../Atom";
import { useRecoilState } from "recoil";
import InstallmentPlan from "../InstallementPlan/InstallementPlan";

const ProductDetails = () => {
  const [InstallementAtom, setinstallmentAtom] =
    useRecoilState(installmentPlan);
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState();
  const [mainImage, setMainImage] = useState(img);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    // Retrieve product id (ensure that it is stored as a string, not a JSON stringified number)
    const storedProductId = localStorage.getItem("product_id");

    if (!storedProductId) {
      toast.error(
        "Couldn't find the product. Please try selecting the product again."
      );
      setLoading(false);
      return;
    }
    // console.log(product, "product");
    try {
      const res = await axios.get(
        `${BASE_URL}/getProduct/product/${storedProductId}`
      );
      if (res.data && res.data.product) {
        localStorage.setItem(
          "selectedproduct",
          JSON.stringify(res.data.product)
        );
        setProduct(res.data.product);
      } else {
        toast.error("Product not found in the response.");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      toast.error("Error fetching product details.");
    } finally {
      setLoading(false);
    }
  };

  // Show a loading indicator until the API call is complete
  if (loading) {
    return (
      <div className="container my-4">
        <h2 className="text-center">Loading...</h2>
      </div>
    );
  }

  // If there's no product after loading is complete, show "Product Not Found"
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="container my-4">
        <h2 className="text-center">Product Not Found</h2>
        <p className="text-center">
          Couldn't find the product you're looking for. <br />
          Please try selecting the product from <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            // href="https://shaamilkar.myshopify.com"
          >
            Shaamilkar.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container pt-5 px-5">
        <div className="row g-5 mb-5">
          <div className="col-md-6">
            <div
              className="d-flex justify-content-center align-items-center bg-white p-2"
              style={{
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                maxHeight: "500px",
              }}
            >
              <img
                src={product?.image?.src || mainImage}
                alt={product.title || "Product Image"}
                className="img-fluid rounded"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <h2 className="mt-3">{product?.title}</h2>
            <h6 className="mt-3">
              Specifications: {product.variants?.[0]?.option1 || "N/A"}
            </h6>
            <div className="mt-4">
              {/* Your product details JSX */}

              <InstallmentPlan product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
