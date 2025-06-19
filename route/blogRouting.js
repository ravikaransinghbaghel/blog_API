import express from 'express';
import upload from '../middleware/img_middle.js'
import { deleteBlog, forgetPasswordController, getBlog, isAdmin, logoutAdmin, postBlog, putAdmin, putBlog, sendEmailToupdateAdmin, sendEmailToupdatePassword } from '../controller/blogController.js';
import { isAdminverify, } from '../middleware/isAdmin.js';
import { forgetPasswordToken } from '../middleware/forgetPassword.js';

const router = express.Router();

router.post('/isAdmin', isAdmin);
router.post('/sendEmailtoForget', sendEmailToupdatePassword);
router.put('/forgetPassword', forgetPasswordToken, forgetPasswordController);
router.get('/blogs', getBlog);
router.post('/blogs', isAdminverify, upload.single('cover_img'), postBlog);
router.put('/update/:id', isAdminverify, putBlog);
router.get('/sendEmailtoUpdate', isAdminverify, sendEmailToupdateAdmin);
router.put('/updateAdmin', isAdminverify, putAdmin);
router.delete('/delete/:id', isAdminverify, deleteBlog);
router.post('/logout', isAdminverify, logoutAdmin);


export default router;
