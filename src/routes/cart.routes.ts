import { Router } from "express";
import { createCartService } from "../services/cart.service";
import { Resource } from "../http/resource";

const router = Router();

router.post("/", async (req, res, next) => {
  const cartService = await createCartService();
  // @ts-expect-error
  const customerId = req.userId;
  const cart = await cartService.createCart(customerId);

  const resource = new Resource(cart);
  next(resource);
});

router.post("/:cartUuid/items", async (req, res, next) => {
  const cartService = await createCartService();
  // @ts-expect-error
  const customerId = req.userId;
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemToCart({
    productId: parseInt(productId),
    quantity: parseInt(quantity),
    uuid: req.params.cartUuid,
    customerId: customerId,
  });

  const resource = new Resource({
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
    })),
    createdAt: cart.createdAt,
    customer: cart.customer
  });
  next(resource);
});

router.get("/:cartUuid", async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.getCart(req.params.cartUuid);

  const resource = new Resource(cart)
  res.json(resource);
});

router.delete("/:cartUuid/items/:cartItemId", async (req, res) => {
  const cartService = await createCartService();
  const { cartItemId } = req.params;
  await cartService.removeItemFromCart({
    cartUuid: req.params.cartUuid,
    cartItemId: parseInt(cartItemId),
  });
  res.send({ message: "Item removed from cart" });
});

router.post("/:cartUuid/clear", async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.clearCart(req.params.cartUuid);

  const resource = new Resource(cart);
  res.json(resource);
});

export default router;
