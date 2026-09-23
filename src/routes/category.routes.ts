import { Router } from 'express';
import { createCategoryService } from '../services/category.service';
import { Resource, ResourceCollection } from '../http/resource';
import cors from "cors";
import { defaultCorsOptions } from "../http/cors";

const corsCollection = cors({
    ...defaultCorsOptions,
    methods: ["GET"],
});

const corsItem = corsCollection;

const router = Router();

router.get('/:categorySlug', corsItem, async (req, res) => {
    const categoryService = await createCategoryService();
    const category = await categoryService.getCategoryBySlug(req.params.categorySlug);

    const resource = new Resource(category);
    res.json(resource);
});

router.get('/', corsCollection, async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { page = 1, limit = 10, name } = req.query;
    const { categories, total } = await categoryService.listCategories({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: { name: name as string }
    });

    res.set('Cache-control', `max-age=${20}`);
    res.json({ categories, total });

    // const collection = new ResourceCollection(categories, {
    //     paginationData: {
    //         total,
    //         page: parseInt(page as string),
    //         limit: parseInt(limit as string)
    //     }
    // })
    // next(collection)
});

router.options(
    "/",
    cors({
        ...defaultCorsOptions,
        methods: ["GET"],
    })
);

router.options(
    "/:categorySlug",
    cors({
        ...defaultCorsOptions,
        methods: ["GET"],
    })
);

export default router;