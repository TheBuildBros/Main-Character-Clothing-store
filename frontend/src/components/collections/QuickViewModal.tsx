"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight, Minus, Plus } from "lucide-react";
import type { Product, ProductSize, ColorSwatch } from "@/data/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNotifyAddedToCart?: (productName: string, size: string) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onNotifyAddedToCart,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [selectedColor, setSelectedColor] = useState<ColorSwatch>(
    product?.colors[0] ?? { name: "Default", hex: "#0B1F3A" }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<"primary" | "alternate">("primary");
  const [isAdded, setIsAdded] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const wishlistItemIds = useWishlistStore((s) => s.itemIds);
  const isWishlisted = Boolean(product && wishlistItemIds.includes(product.id));

  // Sync state whenever product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? "M");
      setSelectedColor(product.colors[0] ?? { name: "Default", hex: "#0B1F3A" });
      setQuantity(1);
      setActiveImage("primary");
      setIsAdded(false);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const currentImageSrc =
    activeImage === "primary" ? product.primaryImage : product.alternateImage;

  const handleAddToCart = () => {
    addItemToCart({
      id: `${product.id}-${selectedSize}-${selectedColor.name}`,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor.name,
      image: product.primaryImage,
    });
    setIsAdded(true);
    if (onNotifyAddedToCart) {
      onNotifyAddedToCart(product.name, selectedSize);
    }
    setTimeout(() => setIsAdded(false), 2400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#091426]/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F8F6F1] border border-[#C6A76A]/25 shadow-[0_24px_80px_rgba(9,20,38,0.35)] z-10 flex flex-col md:flex-row no-scrollbar">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center bg-[#F8F6F1]/90 border border-[#20242B]/15 text-[#20242B] hover:bg-[#0B1F3A] hover:text-[#C6A76A] hover:border-[#0B1F3A] transition-all duration-200"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        {/* Left Side: Product Imagery (5 cols on md) */}
        <div className="md:w-1/2 flex flex-col bg-white border-b md:border-b-0 md:border-r border-[#20242B]/[0.08]">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0EDE6] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageSrc}
              alt={`${product.name} - ${activeImage} view`}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("male-model-desktop")) {
                  target.src = "/images/male-model-desktop.jpg";
                }
              }}
              className="h-full w-full object-cover object-center transition-all duration-500"
            />

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-[#0B1F3A]/90 backdrop-blur-sm border border-[#C6A76A]/40 text-[#C6A76A] text-[9px] uppercase tracking-[0.3em] font-semibold">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Wishlist Button Overlay */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center bg-white/90 backdrop-blur-sm border border-[#20242B]/15 text-[#20242B] hover:text-[#C6A76A] hover:border-[#C6A76A] transition-colors"
            >
              <Heart
                className={`h-4 w-4 ${isWishlisted ? "fill-[#C6A76A] text-[#C6A76A]" : ""}`}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Alternate Angle Thumbnails */}
          <div className="p-3 bg-[#F8F6F1] flex items-center justify-center gap-3 border-t border-[#20242B]/[0.06]">
            <button
              type="button"
              onClick={() => setActiveImage("primary")}
              className={`relative h-14 w-12 border overflow-hidden transition-all ${
                activeImage === "primary"
                  ? "border-[#C6A76A] ring-1 ring-[#C6A76A]"
                  : "border-[#20242B]/20 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.primaryImage}
                alt="Primary angle thumbnail"
                className="h-full w-full object-cover object-center"
              />
            </button>

            <button
              type="button"
              onClick={() => setActiveImage("alternate")}
              className={`relative h-14 w-12 border overflow-hidden transition-all ${
                activeImage === "alternate"
                  ? "border-[#C6A76A] ring-1 ring-[#C6A76A]"
                  : "border-[#20242B]/20 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.alternateImage}
                alt="Alternate angle thumbnail"
                className="h-full w-full object-cover object-center"
              />
            </button>

            <span className="text-[10px] text-[#20242B]/40 uppercase tracking-widest pl-2 font-mono">
              Angle: {activeImage}
            </span>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Actions (5 cols on md) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">

          {/* Top Brand & Category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#20242B]/[0.08] pb-3">
              <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-[#C6A76A]">
                {product.brand}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#20242B]/45 font-mono">
                {product.availability}
              </span>
            </div>

            <h2
              id="quick-view-title"
              className="text-2xl sm:text-3xl text-[#0B1F3A] leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              {product.name}
            </h2>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-1">
              <span
                className="text-2xl text-[#0B1F3A] font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#20242B]/40 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount && (
                <span className="text-[10px] font-semibold text-[#C6A76A] bg-[#C6A76A]/10 border border-[#C6A76A]/30 px-2 py-0.5 uppercase tracking-wider">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="text-xs text-[#20242B]/70 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Selectors */}
          <div className="space-y-4 pt-2 border-t border-[#20242B]/[0.08]">
            {/* Color Swatches */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                <span className="font-semibold text-[#0B1F3A]">Color</span>
                <span className="text-[#C6A76A] font-medium">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name}`}
                      className={`h-7 w-7 rounded-full border transition-all flex items-center justify-center ${
                        isSelected
                          ? "border-[#0B1F3A] ring-2 ring-[#C6A76A] scale-110"
                          : "border-[#20242B]/20 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`h-3 w-3 ${
                            color.hex === "#F8F6F1" || color.hex === "#C6A76A"
                              ? "text-[#0B1F3A]"
                              : "text-white"
                          }`}
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                <span className="font-semibold text-[#0B1F3A]">Size</span>
                <span className="text-[#20242B]/40 font-light">Japanese Standard Cut</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[42px] h-9 border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isSelected
                          ? "border-[#0B1F3A] bg-[#0B1F3A] text-[#C6A76A]"
                          : "border-[#20242B]/15 bg-white text-[#20242B] hover:border-[#0B1F3A]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0B1F3A]">
                Quantity
              </span>
              <div className="flex items-center border border-[#20242B]/15 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-1.5 hover:bg-[#0B1F3A]/5 transition-colors"
                >
                  <Minus className="h-3 w-3 text-[#20242B]" strokeWidth={1.5} />
                </button>
                <span className="px-3.5 text-xs font-semibold text-[#0B1F3A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="p-1.5 hover:bg-[#0B1F3A]/5 transition-colors"
                >
                  <Plus className="h-3 w-3 text-[#20242B]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3 border-t border-[#20242B]/[0.08]">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 ${
                isAdded
                  ? "bg-[#C6A76A] text-[#0B1F3A]"
                  : "bg-[#0B1F3A] text-[#C6A76A] hover:bg-[#C6A76A] hover:text-[#0B1F3A]"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{isAdded ? "Added to Bag ✓" : "Add to Shopping Bag"}</span>
            </button>

            <Link
              href={`/collections/season-01-core`}
              onClick={onClose}
              className="w-full py-2.5 bg-transparent border border-[#0B1F3A]/20 text-[#0B1F3A] hover:border-[#0B1F3A] text-[9px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Atelier Specimen Details</span>
              <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-2 border-t border-[#20242B]/[0.06] flex items-center justify-around text-[9px] text-[#20242B]/50 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3 w-3 text-[#C6A76A]" strokeWidth={1.5} />
              <span>Complimentary Shipping</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-[#C6A76A]" strokeWidth={1.5} />
              <span>Tokyo Authenticated</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
