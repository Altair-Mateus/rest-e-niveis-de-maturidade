import { Router } from 'express';
import { createCategoryService } from '../../services/category.service';
import { Resource, ResourceCollection } from '../../http/resource';
import { runInNewContext } from 'vm';

const router = Router();

router.post('/', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { name, slug } = req.body;
    const category = await categoryService.createCategory({ name, slug });

    const resource = new Resource(category);
    next(resource);
});

router.get('/:categoryId', async (req, res) => {
    const categoryService = await createCategoryService();
    const category = await categoryService.getCategoryById(+req.params.categoryId);

    const resource = new Resource(category);
    res.json(resource);
});

router.patch('/:categoryId', async (req, res) => {
    const categoryService = await createCategoryService();
    const { name, slug } = req.body;
    const category = await categoryService.updateCategory({ id: +req.params.categoryId, name, slug });

    const resource = new Resource(category);
    res.json(resource);
});

router.delete('/:categoryId', async (req, res) => {
    const categoryService = await createCategoryService();
    const { categoryId } = req.params;
    await categoryService.deleteCategory(+categoryId);
    res.json({ message: 'Category deleted' });
});

router.get('/', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { page = 1, limit = 10, name } = req.query;
    const { categories, total } = await categoryService.listCategories({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: { name: name as string }
    });

    const collection = new ResourceCollection(categories, {
        paginationData: {
            total,
            page: parseInt(page as string),
            limit: parseInt(limit as string)
        }
    });
    next(collection);
});

export default router;