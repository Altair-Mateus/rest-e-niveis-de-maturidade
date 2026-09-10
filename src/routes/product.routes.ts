import { Router } from "express";
import { createProductService } from "../services/product.service";
import { Resource, ResourceCollection } from "../http/resource";

const router = Router();

router.get("/:productSlug", async (req, res) => {
  const productService = await createProductService();
  const product = await productService.getProductBySlug(
    req.params.productSlug as string
  );

  const resource = new Resource(product);
  res.json(resource);
});

router.get("/", async (req, res, next) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });

  const collection = new ResourceCollection(products, {
    paginationData: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    }
  });
  next(collection)
});

export default router;
