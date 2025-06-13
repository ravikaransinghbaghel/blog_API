import blog from "../model/blog.js";
import admin from "../model/admin.js";
import jwt from 'jsonwebtoken';
// import { uploadImg } from './cloudinaryImg.js' // use for save file on local then cloud


export const postBlog = async (req, res) => {
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // console.log("img path : ", req.file);

    /*    
    const result = await uploadImg(req.file.path);
    console.log("from control :", result);
    const imageUrl = result.secure_url;
    const publicId = result.public_id;
     */

    try {
        const newBlog = new blog({
            author,
            title,
            content,
            cover_img_path: req.file.path,
            cover_img_id: req.file.filename,

        });



        await newBlog.save();
        res.status(200).json({ massage: 'save  the data on DB successfull' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getBlog = async (req, res) => {

    try {
        const blogs = await blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching blogs" });
    }
};

export const putBlog = async (req, res) => {
    const id = req.params.id;
    const { author, title, content } = req.body;

    try {
        const updateBlogs = await blog.findByIdAndUpdate(id, { author, title, content }, { new: true });
        res.status(200).json(updateBlogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching blogs" });
    }
};

export const deleteBlog = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedBlog = await blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
};

export const isAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const isAdmin = await admin.findOne({ username, password })

        if (!isAdmin) {
            return res.status(401).json({ massage: "only for admin" });
        }

        const token = jwt.sign({ id: isAdmin._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
        //  console.log('token ', token);

        res.status(200)
            .cookie('blogAdminToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({ massage: 'you are admin . you can update our blog site'  });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching admin" });
    }

}
export const logoutAdmin = (req, res) => {
    res.clearCookie('blogAdminToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
    });

    res.status(200).json({ message: 'Logout successful' });
};
