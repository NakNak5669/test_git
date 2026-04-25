import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mockCategories, mockProducts } from "../data/mock";
import ProductCard from "../components/ProductCard";
import CategoryChips from "../components/CategoryChips";
import PriceRange from "../components/PriceRange";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";
import "../styles/Home.css";

export default function Home() {
  const { addToCart } = useCart();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const filtered = useMemo(() => {
    let list = [...mockProducts];

    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(qq) ||
          p.category.toLowerCase().includes(qq)
      );
    }

    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [q, category, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  function resetFilters() {
    setCategory("All");
    setMaxPrice(200);
    setSort("featured");
    setPage(1);
    setParams((prev) => {
      prev.delete("q");
      return prev;
    });
  }

  // keep page in range
  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="container home">
      <section className="hero">
        <div>
          <h1>UI First Shop</h1>
          <p className="muted">
            This is a clean UI template. Later you’ll swap <code>mockProducts</code> with Platzi API data.
          </p>
        </div>
        <button className="btn" onClick={resetFilters}>Reset</button>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h3>Categories</h3>
            <CategoryChips
              categories={mockCategories}
              value={category}
              onChange={(c) => {
                setCategory(c);
                setPage(1);
              }}
            />
          </div>

          <div className="panel">
            <h3>Price</h3>
            <PriceRange
              min={0}
              max={200}
              value={maxPrice}
              onChange={(v) => {
                setMaxPrice(v);
                setPage(1);
              }}
            />
          </div>

          <div className="panel">
            <h3>Sort</h3>
            <select
              className="select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top rating</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </div>

          {q ? (
            <div className="panel info">
              <div className="muted">Search</div>
              <strong className="mono">"{q}"</strong>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setParams((prev) => {
                    prev.delete("q");
                    return prev;
                  });
                  setPage(1);
                }}
              >
                Clear search
              </button>
            </div>
          ) : null}
        </aside>

        <section className="content">
          <div className="content-top">
            <div>
              <strong>{filtered.length}</strong> items
            </div>

            <div className="pager">
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="muted">
                Page <strong>{page}</strong> / {totalPages}
              </span>
              <button
                className="btn btn-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>

          {paged.length === 0 ? (
            <EmptyState
              title="No products found"
              subtitle="Try changing filters or reset."
              action={<button className="btn" onClick={resetFilters}>Reset</button>}
            />
          ) : (
            <div className="grid">
              {paged.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}