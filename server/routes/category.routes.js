import express from 'express';
import * as ctrl from '../controllers/category.controller.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import auth from '../middlewares/auth.js';

const router = express.Router();
router.get('/', ctrl.listCategories);
router.get('/:id', auth, ctrl.getCategory);
router.post('/', auth, upload.array('images', 4), ctrl.createCategory);
router.put('/:id', auth, upload.array('images', 4), ctrl.updateCategory);
router.delete('/:id', auth, ctrl.deleteCategory);


export default router;
