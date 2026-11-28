import { ArrowLeft, ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, products, useStore } from "@/store/Storefront";
import { ScrollReveal } from "@/components/MotionPrimitives";

export default function Wishlist() {
  const { favorites, toggleFavorite, addToBag, toast } = useStore();

  const savedProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  if (!savedProducts.length) {
    return (
      <div className="bag-page max-w-5xl mx-auto">
        <div className="breadcrumbs">
          <Link href="/" className="hover:text-[var(--blue)] transition-colors">
            HOME
          </Link>{" "}
          <span>/</span> WISHLIST
        </div>
        <ScrollReveal>
          <div className="empty-bag">
            <div className="empty-bag-icon" aria-hidden="true">
              <Heart size={26} />
            </div>
            <span className="eyebrow">SAVED FOR LATER</span>
            <h1>
              Your wishlist is
              <br />
              waiting for you.
            </h1>
            <p>Tap the heart on any piece to keep track of your favorites here.</p>
            <Link
              className="button-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
              href="/collections"
            >
              Continue shopping <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="bag-recommend">
          <h2>Good place to start</h2>
          <div className="mini-recommendations">
            {products.slice(0, 3).map((p) => (
              <Link href={`/product/${p.id}`} key={p.id}>
                <img src={p.image} alt={p.name} />
                <span>{p.name}</span>
                <strong>{formatPrice(p.price)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bag-page max-w-7xl mx-auto">
      <div className="breadcrumbs">
        <Link href="/" className="hover:text-[var(--blue)] transition-colors">
          HOME
        </Link>{" "}
        <span>/</span> WISHLIST
      </div>

      <ScrollReveal>
        <div className="bag-heading">
          <div>
            <span className="eyebrow">SAVED FOR LATER</span>
            <h1>
              Your wishlist<span className="blue-period">.</span>
            </h1>
          </div>
          <span>
            {savedProducts.length}{" "}
            {savedProducts.length === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>
      </ScrollReveal>

      <section className="bag-lines mt-4" aria-label="Saved wishlist items">
        <AnimatePresence>
          {savedProducts.map((product) => {
            const defaultSize = product.sizes.includes("M")
              ? "M"
              : product.sizes[0];
            return (
              <motion.article
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bag-line"
                key={product.id}
              >
                <Link href={`/product/${product.id}`} className="bag-image">
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="bag-item-copy">
                  <span className="eyebrow">{product.category}</span>
                  <Link href={`/product/${product.id}`} className="bag-item-name">
                    {product.name}
                  </Link>
                  <span className="bag-item-meta">
                    {product.color} ·{" "}
                    {product.sizes.length === 1
                      ? "One size"
                      : `Sizes ${product.sizes.join(" · ")}`}
                  </span>
                  <div className="bag-item-bottom flex-wrap">
                    <button
                      type="button"
                      className="button-primary !min-h-[36px] !px-4 !text-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                      aria-label={`Add ${product.name} (Size ${defaultSize}) to bag`}
                      onClick={() =>
                        addToBag(product.id, defaultSize, 1, product.color)
                      }
                    >
                      <ShoppingBag size={13} aria-hidden="true" />
                      <span>Add to bag · {defaultSize}</span>
                    </button>
                    <button
                      type="button"
                      className="remove-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]"
                      aria-label={`Remove ${product.name} from wishlist`}
                      onClick={() => {
                        toggleFavorite(product.id);
                        toast("Removed from wishlist", "info");
                      }}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <strong className="bag-line-price">
                  {formatPrice(product.price)}
                </strong>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </section>

      <Link className="continue-link" href="/collections">
        <ArrowLeft size={15} aria-hidden="true" /> Continue shopping
      </Link>
    </div>
  );
}
