import { useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice, products, useStore } from "@/store/Storefront";
import { ScrollReveal } from "@/components/MotionPrimitives";

export default function Bag() {
  const { bag, setQuantity, removeFromBag, toast } = useStore();
  const [checkout, setCheckout] = useState(false);

  const lines = bag
    .map((line) => ({
      ...line,
      product: products.find((p) => p.id === line.productId),
    }))
    .filter((line) => line.product);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product!.price * line.quantity,
    0
  );

  if (!lines.length) {
    return (
      <div className="bag-page max-w-5xl mx-auto">
        <div className="breadcrumbs">
          <Link href="/" className="hover:text-[var(--blue)] transition-colors">
            HOME
          </Link>{" "}
          <span>/</span> YOUR BAG
        </div>
        <ScrollReveal>
          <div className="empty-bag">
            <div className="empty-bag-icon">
              <ShoppingBag size={26} />
            </div>
            <span className="eyebrow">A LITTLE SPACE FOR SOMETHING GOOD</span>
            <h1>
              Your bag is
              <br />
              having a moment.
            </h1>
            <p>Nothing here yet. Find a piece that feels like you.</p>
            <Link className="button-primary" href="/collections">
              Explore the collection <ArrowRight size={16} />
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
        <span>/</span> YOUR BAG
      </div>

      <ScrollReveal>
        <div className="bag-heading">
          <div>
            <span className="eyebrow">THE GOOD STUFF</span>
            <h1>
              Your bag<span className="blue-period">.</span>
            </h1>
          </div>
          <span>{lines.reduce((n, line) => n + line.quantity, 0)} PIECES</span>
        </div>
      </ScrollReveal>

      <div className="bag-layout">
        <section className="bag-lines">
          <AnimatePresence>
            {lines.map((line) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bag-line"
                key={`${line.productId}-${line.size}`}
              >
                <Link href={`/product/${line.product!.id}`} className="bag-image">
                  <img src={line.product!.image} alt={line.product!.name} />
                </Link>
                <div className="bag-item-copy">
                  <span className="eyebrow">{line.product!.category}</span>
                  <Link href={`/product/${line.product!.id}`} className="bag-item-name">
                    {line.product!.name}
                  </Link>
                  <span className="bag-item-meta">
                    {line.product!.color} · Size {line.size}
                  </span>
                  <div className="bag-item-bottom">
                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          line.quantity === 1
                            ? removeFromBag(line.productId, line.size)
                            : setQuantity(line.productId, line.size, line.quantity - 1)
                        }
                      >
                        <Minus size={13} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQuantity(line.productId, line.size, line.quantity + 1)
                        }
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="remove-line"
                      onClick={() => {
                        removeFromBag(line.productId, line.size);
                        toast("Removed from your bag", "info");
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <strong className="bag-line-price">
                  {formatPrice(line.product!.price * line.quantity)}
                </strong>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>

        <aside className="order-summary">
          <span className="eyebrow">THE NUMBERS</span>
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{subtotal >= 5000 ? "On us" : "Calculated at checkout"}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <p className="tax-note">Taxes included where applicable.</p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            className="button-primary checkout-button"
            onClick={() => setCheckout(true)}
          >
            Continue to checkout <ArrowRight size={16} />
          </motion.button>
          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Checkout is a demo handoff. No payment will be taken.</span>
          </div>
          {checkout && (
            <div className="checkout-notice" role="status">
              <strong>You're ready for the next step.</strong>
              <p>
                This storefront prototype has no payment provider connected, so no order
                or charge was created.
              </p>
              <button type="button" className="text-link" onClick={() => setCheckout(false)}>
                Got it
              </button>
            </div>
          )}
          <Link className="continue-link" href="/collections">
            <ArrowLeft size={15} /> Keep looking
          </Link>
        </aside>
      </div>
    </div>
  );
}
