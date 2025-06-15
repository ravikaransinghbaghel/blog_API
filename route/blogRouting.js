import express from 'express';
import upload from '../middleware/img_middle.js'
import { deleteBlog, getBlog, isAdmin, logoutAdmin, postBlog, putBlog } from '../controller/blogController.js';
import { isAdminverify } from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/isAdmin', isAdmin)
router.get('/blogs', getBlog);
router.post('/blogs',isAdminverify, upload.single('cover_img'), postBlog);
router.put('/update/:id', isAdminverify, putBlog);
router.delete('/delete/:id/:publicId', isAdminverify, deleteBlog);
router.post('/logout', isAdminverify, logoutAdmin);

export default router;
