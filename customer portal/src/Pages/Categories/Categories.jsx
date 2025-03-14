import React, { useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { categoriesData } from './CategoriesData';
import { Button } from 'react-bootstrap';

const Categories = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const gridRef = useRef(null);

    const handleToggleVisibility = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="p-4 pt-0">
            <h3 className="ms-2 text-start fw-bold mb-2 ms-5">Categories</h3>
            <div
                className="grid-container px-5 py-3 px-md-0 px-lg-5"
                ref={gridRef}
                style={{
                    display: 'grid',
                    gap: '16px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    justifyContent: 'center',
                    transition: 'max-height 1.5s ease-in-out, opacity 0.5s ease-in-out',
                    maxHeight: isExpanded ? '1000px' : '250px',
                    overflow: 'hidden',
                }}
            >
                {categoriesData.slice(0, isExpanded ? categoriesData.length : 7).map((item, index) => (
                    <div
                        key={index}
                        className="border rounded-4 bg-white category-item"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            className="w-100 py-1"
                            style={{ height: '150px', maxHeight: '150px' }}
                        >
                            <img
                                src={item.imageURL}
                                className="img-fluid"
                                style={{
                                    height: '140px',
                                    maxHeight: '140px',
                                    objectFit: 'cover',
                                    borderRadius: '10px 10px 0 0',
                                }}
                                alt=""
                            />
                        </div>
                        <Card.Body className="py-3">
                            <Card.Title>{item.name}</Card.Title>
                        </Card.Body>
                    </div>
                ))}
            </div>
            <div className="text-center mt-2 px-5">
                <Button
                    variant="light"
                    className="w-100 bg-white fw-semibold btn btn-lg rounded-3 glow border-0"
                    onClick={handleToggleVisibility}
                    style={{
                        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {isExpanded ? `Show Less` : 'Show More'}
                </Button>
            </div>
        </div>
    );
};

export default Categories;
