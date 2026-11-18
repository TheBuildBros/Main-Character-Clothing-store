import { Router } from "express";
import productsRouter from "./products";
import cartRouter from "./cart";
import wishlistRouter from "./wishlist";
import ordersRouter from "./orders";
import authRouter from "./auth";

const router = Router();

// TODO: API routes router
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/orders", ordersRouter);
router.use("/auth", authRouter);

export default router;
