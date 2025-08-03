import React from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => {
  const sizes = product.sizes || {};
  const motorKeys = Object.keys(sizes);
  const firstMotor = motorKeys.length > 0 ? motorKeys[0] : null;
  const variantKeys = firstMotor ? Object.keys(sizes[firstMotor] || {}) : [];
  const firstVariant = variantKeys.length > 0 ? variantKeys[0] : null;
  
  const hargaReseller = firstMotor && firstVariant
    ? sizes[firstMotor][firstVariant].reseller
    : undefined;

  return (
    <Link to={`/product/${product._id}`}>
      <div className="border p-4 rounded-md shadow-md">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-[150px] h-[150px] object-cover mb-2 rounded"
        />
        <h3 className="text-sm font-semibold text-center">{product.name}</h3>
        <p className="text-sm text-gray-600 text-center">{product.brand}</p>
        <p className="text-sm text-primary font-bold mt-1">
          Rp { (hargaReseller ?? 0).toLocaleString() }
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
