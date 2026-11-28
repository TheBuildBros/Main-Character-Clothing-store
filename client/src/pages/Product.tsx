import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus } from "lucide-react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import {
  formatPrice,
  MAX_BAG_QUANTITY,
  MIN_BAG_QUANTITY,
  ProductCard,
  products,
  useStore,
} from "@/store/Storefront";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/MotionPrimitives";

export default function Product() {
  const [, params] = useRoute("/product/:id");
  const product = products.find((item) => item.id === params?.id);
  const { bag, addToBag, favorites, toggleFavorite, toast } = useStore();
  const [size, setSize] = useState(() =>
    product?.sizes.length === 1 ? product.sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState(() => product?.color ?? "");
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(MIN_BAG_QUANTITY);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const addedTimerRef = useRef<number | null>(null);

  // Reset product selection state cleanly when navigating to a different product
  useEffect(() => {
    setSize(product?.sizes.length === 1 ? product.sizes[0] : "");
    setSelectedColor(product?.color ?? "");
    setAdded(false);
    setQuantity(MIN_BAG_QUANTITY);
    setShowSizeGuide(false);
    if (addedTimerRef.current !== null) {
      window.clearTimeout(addedTimerRef.current);
      addedTimerRef.current = null;
    }
  }, [params?.id, product?.color, product?.sizes]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

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
  const missingSize = !size;
  const missingColor = !selectedColor;
  const isAddDisabled = missingSize || missingColor;

  const disabledReason =
    missingSize && missingColor
      ? "Select a size and color to add this piece to your bag."
      : missingSize
      ? "Select a size above to add this piece to your bag."
      : missingColor
      ? "Select a color above to add this piece to your bag."
      : "";

  const matchingBagLine = size
    ? bag.find(
        (line) =>
          line.productId === product.id &&
          line.size === size &&
          line.color === selectedColor
      )
    : undefined;

  const totalProductInBag = bag
    .filter((line) => line.productId === product.id)
    .reduce((sum, line) => sum + line.quantity, 0);

  const onAdd = () => {
    if (isAddDisabled) return;
    addToBag(product.id, size, quantity, selectedColor);
    setAdded(true);
    if (addedTimerRef.current !== null) {
      window.clearTimeout(addedTimerRef.current);
    }
    addedTimerRef.current = window.setTimeout(() => {
      setAdded(false);
      addedTimerRef.current = null;
    }, 1500);
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
            <button
              type="button"
              aria-pressed={selectedColor === product.color}
              aria-label={`Select color ${product.color}`}
              onClick={() => setSelectedColor(product.color)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)] ${
                selectedColor === product.color
                  ? "border-[var(--blue)] bg-[var(--surface)] text-[var(--text)]"
                  : "border-[var(--line)] bg-transparent text-[var(--muted)]"
              }`}
            >
              <i style={{ background: product.colorHex }} aria-hidden="true" />
              <span>{product.color}</span>
            </button>
          </div>

          <div className="size-heading">
            <span>SELECT SIZE</span>
            <button
              type="button"
              className="text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              aria-expanded={showSizeGuide}
              aria-controls="size-guide"
              onClick={() => setShowSizeGuide((v) => !v)}
            >
              Size guide <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>

          <div className="size-selectors" role="group" aria-label="Available sizes">
            {product.sizes.map((item) => (
              <motion.button
                key={item}
                type="button"
                whileTap={{ scale: 0.94 }}
                aria-pressed={size === item}
                aria-label={`Size ${item}`}
                className={`${size === item ? "selected" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]`}
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

          {isAddDisabled && (
            <p
              id="add-to-bag-reason"
              role="status"
              className="select-size-note !text-[var(--blue)] font-medium"
            >
              {disabledReason}
            </p>
          )}

          <div className="detail-actions">
            <div className="quantity-control" role="group" aria-label="Quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= MIN_BAG_QUANTITY}
                onClick={() => setQuantity((v) => Math.max(MIN_BAG_QUANTITY, v - 1))}
                className="disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              >
                <Minus size={13} aria-hidden="true" />
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= MAX_BAG_QUANTITY}
                onClick={() => setQuantity((v) => Math.min(MAX_BAG_QUANTITY, v + 1))}
                className="disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              >
                <Plus size={13} aria-hidden="true" />
              </button>
            </div>
            <motion.button
              type="button"
              whileTap={isAddDisabled ? undefined : { scale: 0.98 }}
              className="button-primary add-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              disabled={isAddDisabled}
              aria-describedby={isAddDisabled ? "add-to-bag-reason" : undefined}
              aria-label={isAddDisabled ? `Add to bag — ${disabledReason}` : "Add to bag"}
              onClick={onAdd}
            >
              {added ? (
                <>
                  <Check size={16} aria-hidden="true" /> Added to bag
                </>
              ) : (
                <>
                  Add to bag <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.86 }}
              className={`detail-favorite ${isSaved ? "is-favorite" : ""} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]`}
              aria-pressed={isSaved}
              aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => {
                toggleFavorite(product.id);
                toast(isSaved ? "Removed from wishlist" : "Saved to wishlist", "info");
              }}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} aria-hidden="true" />
            </motion.button>
          </div>

          {totalProductInBag > 0 && (
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
              <span>
                {matchingBagLine
                  ? `${matchingBagLine.quantity} in your bag (Size ${matchingBagLine.size})`
                  : `${totalProductInBag} ${totalProductInBag === 1 ? "piece" : "pieces"} of this item in your bag`}
              </span>
              <Link
                href="/bag"
                className="font-semibold text-[var(--blue)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              >
                View bag
              </Link>
            </div>
          )}

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
              Shop all <ArrowRight size={16} aria-hidden="true" />
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
        <ArrowLeft size={15} aria-hidden="true" /> Back to the collection
      </Link>
    </div>
  );
}
