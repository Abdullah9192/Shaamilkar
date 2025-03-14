import React, { useEffect,useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { productsData } from './ProductsData';
import { useNavigate } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';

const Products = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(10); 
    const [isExpanded, setIsExpanded] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const gridRef = useRef(null);

    const handleToggleVisibility = () => {
        if (isExpanded) {
            setVisible(10); 
            setIsExpanded(false);
        } else {
            setVisible(productsData.length);
            setIsExpanded(true);
        }
    };

    const truncateText = (text, charLimit) => {
        if (text.length > charLimit) {
            return text.slice(0, charLimit) + '..';
        }
        return text;
    };

    // const handleBuyNow = (productId) => {
    //     if (!loggedIn) {
    //         navigate('/login');
    //         return;
    //     }else{
    //         navigate(`/productDetails/${productId}`);
    //         document.body.scrollTop = 0;
    //         document.documentElement.scrollTop = 0;
    //     }
      
    // };
    useEffect(() => {
   
        const userLoggedIn = localStorage.getItem("loggedIn");
        setLoggedIn(userLoggedIn === "true");
      }, []);

    return (
        <div className="mt-2 p-4">
            <h3 className="text-start fw-bold ms-5 ">All Products</h3>
            <div
                className={`grid-container px-5 py-3 ${isExpanded ? 'expanded' : 'collapsed'}   `}
                ref={gridRef}
                style={{
                    transition: 'max-height 0.7s ease-in-out, opacity 0.3s ease-in-out',
                    maxHeight: isExpanded ? `${gridRef.current.scrollHeight}px` : '400px',
                    overflow: 'hidden',
                    opacity: isExpanded ? 1 : 0.9
                }}
            >
                {productsData.slice(0, visible).map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-4 bg-white category-item"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '16px',
                            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            className="w-100"
                            style={{
                                height: '160px',
                                maxHeight: '160px',
                                marginBottom: '10px',
                            }}
                        >
                            <img
                                src={product.imageURL}
                                alt={product.name}
                                className="img-fluid"
                                style={{
                                    height: '150px',
                                    maxHeight: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                            />
                        </div>
                        <div className="text-start">
                            <h5 className="text-muted mb-1">{product.price}</h5>
                            <p className="mb-1">{truncateText(product.name, 45)}</p>
                            <p className="text-muted mb-3 mt-3">{product.stock} in stock</p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <Button
                                className="w-50 border-0 text-dark btn button shadow-none"
                                onClick={() => navigate(`/productDetails/${product.id}`)}
                            >
                                Buy
                            </Button>
                            <Button
                                variant="border-0"
                                className="ms-2"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FaCartShopping />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-3 px-5">
                <Button
                    variant="light"
                    className="w-100 fw-semibold bg-white rounded-3 btn btn-lg border-0 glow"
                    onClick={handleToggleVisibility}
                >
                    {isExpanded ? 'Show Less' : 'Show More'}
                </Button>
            </div>
        </div>
    );
};

export default Products;
