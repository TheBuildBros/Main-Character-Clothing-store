import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus } from "lucide-react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { formatPrice, ProductCard, products, useStore } from "@/store/Storefront";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/MotionPrimitives";

export default function Product() {
  const [, params] = useRoute("/product/:id");
  const product = products.find((item) => item.id === params?.id);
  const { addToBag, favorites, toggleFavorite, toast } = useStore();
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Reset product selection state cleanly when navigating to a different product
  useEffect(() => {
    setSize(product?.sizes.length === 1 ? product.sizes[0] : "");
    setAdded(false);
    setQuantity(1);
    setShowSizeGuide(false);
  }, [params?.id]);

  if (!product) {
    return (
      <div className="product-detail-page max-w-4xl mx-auto">
        <div className="empty-results product-missing">
          <h1>This piece is out of frame.</h1>
          <p>It may have moved on. There are more things to find.</p>
          <Link className="button-primary" href="/collections">
            Back to the collection
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = favorites.includes(product.id);

  const onAdd = () => {
    if (!size) return;
    addToBag(product.id, size, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-detail-page max-w-7xl mx-auto">
      <div className="breadcrumbs">
        <Link href="/" className="hover:text-[var(--blue)] transition-colors">
          HOME
        </Link>{" "}
        <span>/</span>{" "}
        <Link href="/collections" className="hover:text-[var(--blue)] transition-colors">
          SHOP ALL
        </Link>{" "}
        <span>/</span> {product.category.toUpperCase()}
      </div>

      <div className="product-detail">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="detail-image"
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ backgroundColor: product.tone }}
          />
          <span className="detail-image-caption">
            MC / OBJECT STUDY {product.id.slice(0, 2).toUpperCase()}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="detail-copy"
        >
          <span className="eyebrow">{product.tag || "主人公 オリジナル"}</span>
          <h1>
            {product.name}
            <span className="blue-period">.</span>
          </h1>
          <div className="detail-price flex items-baseline gap-2.5">
            <span>{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="line-through text-[var(--muted)] text-xs font-medium">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-[10px] tracking-[0.12em] text-[var(--muted)] font-semibold">
              INCL. TAX
            </span>
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-color">
            <span>COLOR</span>
            <span>
              <i style={{ background: product.colorHex }} />
              {product.color}
            </span>
          </div>

          <div className="size-heading">
            <span>SELECT SIZE</span>
            <button
              type="button"
              className="text-link"
              aria-expanded={showSizeGuide}
              aria-controls="size-guide"
              onClick={() => setShowSizeGuide((v) => !v)}
            >
              Size guide <ArrowRight size={13} />
            </button>
          </div>

          <div className="size-selectors">
            {product.sizes.map((item) => (
              <motion.button
                key={item}
                type="button"
                whileTap={{ scale: 0.94 }}
                className={size === item ? "selected" : ""}
                onClick={() => setSize(item)}
              >
                {item}
              </motion.button>
            ))}
          </div>

          <div id="size-guide" className={`size-guide ${showSizeGuide ? "visible" : ""}`}>
            Designed for a relaxed fit. Between sizes? Choose your usual size for ease,
            or size down for a closer fit.
          </div>

          {!size && <p className="select-size-note">Choose a size to continue.</p>}

          <div className="detail-actions">
            <div className="quantity-control">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              >
                <Minus size={13} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((v) => v + 1)}
              >
                <Plus size={13} />
              </button>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              className="button-primary add-button"
              disabled={!size}
              onClick={onAdd}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to bag
                </>
              ) : (
                <>
                  Add to bag <ArrowRight size={16} />
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.86 }}
              className={`detail-favorite ${isSaved ? "is-favorite" : ""}`}
              aria-label={isSaved ? "Remove from saved pieces" : "Save piece"}
              onClick={() => {
                toggleFavorite(product.id);
                toast(isSaved ? "Removed from saved pieces" : "Saved for later", "info");
              }}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </motion.button>
          </div>

          <div className="detail-promise">
            <span>01</span> Easy returns within 14 days
          </div>
          <div className="detail-promise">
            <span>02</span> Complimentary shipping above ₹5,000
          </div>
          <div className="detail-promise">
            <span>03</span> Thoughtfully sourced, made to be worn
          </div>
        </motion.div>
      </div>

      <div className="you-may-like">
        <ScrollReveal>
          <div className="section-heading">
            <div>
              <span className="eyebrow">KEEP THE STORY GOING</span>
              <h2>Make it a look.</h2>
            </div>
            <Link href="/collections" className="text-link">
              Shop all <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <StaggerItem key={item.id}>
                <ProductCard product={item} />
              </StaggerItem>
            ))}
        </StaggerGrid>
      </div>

      <Link href="/collections" className="back-to-shop">
        <ArrowLeft size={15} /> Back to the collection
      </Link>
    </div>
  );
}
