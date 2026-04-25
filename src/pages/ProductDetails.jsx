import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mockProducts } from "../data/mock";
import RatingStars from "../components/RatingStars";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = useMemo(
    () => mockProducts.find((p) => String(p.id) === String(id)),
    [id]
  );

  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="container">
        <p className="muted">Product not found.</p>
        <Link className="btn" to="/">Go home</Link>
      </div>
    );
  }

  return (
    <div className="container details">
      <Link to="/" className="back">← Back</Link>

      <div className="details-card">
        <div className="gallery">
          <img
            className="main-img"
            src={product.images?.[activeImage]}
            alt={product.title}
          />
          <div className="thumbs">
            {product.images?.map((src, idx) => (
              <button
                key={src}
                className={idx === activeImage ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(idx)}
                type="button"
                aria-label={`View image ${idx + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="info">
          <span className="pill">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="rating-row">
            <RatingStars value={product.rating} />
            <span className="muted">{product.rating}/5</span>
          </div>

          <p className="muted">{product.description}</p>

          <div className="buy">
            <div className="price big">${product.price.toFixed(2)}</div>
            <button className="btn btn-primary" onClick={() => addToCart(product)}>
              Add to cart
            </button>
          </div>

          <div className="note">
            <strong>UI Tip:</strong> Later you will replace <code>mockProducts</code> with API data.
          </div>
        </div>
      </div>
    </div>
  );
}