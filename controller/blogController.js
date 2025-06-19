import blog from "../model/blog.js";
import admin from "../model/admin.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
// import { uploadImg } from './cloudinaryImg.js' // use for save file on local then cloud

let issendEmail = false;
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AuthorEmail,
            pass: process.env.EmailPass
        }
    });
    await transporter.sendMail({
        from: process.env.AuthorEmail,
        to: to,
        subject: subject,
        html: text
    });
}

export const sendEmailToupdatePassword = async (req, res) => {
    const { email, mob_no, } = req.body;

    try {
        const isAdmin = await admin.findOne({ email, mob_no });

        if (!isAdmin) {
            return res.status(404)
                .json({ success: false, error: "Admin not found" });
        }

        const resetLink = `https://blog-api-hxsk.onrender.com`;

        const htmlContent = `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>Reset Your Password</title>
                  <style>
                    /* Inline styles are important for email compatibility */
                    .button {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #4CAF50;
                      color: white;
                      text-decoration: none;
                      font-weight: bold;
                      border-radius: 5px;
                    }
              
                    .button:hover {
                      background-color: #45a049;
                    }
              
                    .container {
                      font-family: Arial, sans-serif;
                      padding: 20px;
                      background-color: #f7f7f7;
                      color: #333;
                    }
              
                    .box {
                      max-width: 600px;
                      margin: auto;
                      background-color: #ffffff;
                      padding: 30px;
                      border-radius: 10px;
                      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    }
              
                    .footer {
                      margin-top: 30px;
                      font-size: 12px;
                      color: #888;
                      text-align: center;
                    }
                  </style>
                </head>
              
                <body>
                  <div class="container">
                    <div class="box">
                      <h2>Reset Your Password</h2>
                      <p>Hello, ${isAdmin.name}</p>
                      <p>We received a request to reset your password. Click the button below to reset it:</p>
              
                      <p style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" class="button">Reset Password</a>
                      </p>
              
                      <p>If you didn't request this, you can ignore this email. This link will expire in 15 minutes.</p>
              
                      <p>Thanks,<br/>my blog</p>
                    </div>
              
                    <div class="footer">
                      &copy; 2025 my blog. All rights reserved.
                    </div>
                  </div>
                </body>
              </html>
       `;
        const token = jwt.sign({ id: isAdmin._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        await sendEmail(isAdmin.email, 'forget password Email Notification', htmlContent);
        res.status(200)
            .cookie('forgetPasswordToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                // sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({ message: 'Email sent successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error sending email" });
    }
}
export const sendEmailToupdateAdmin = async (req, res) => {

    try {
        const adminUser = await admin.findOne({ _id: req.isAdmin_id });

        if (!adminUser) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const htmlContent = `
                      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                          
                          <h2 style="color: #333;">Hello, ${adminUser.name}</h2>
                          
                          <p style="font-size: 16px; color: #555;">
                            This email is to notify you that you can now update your details.
                          </p>
                          
                          <p style="font-size: 16px; color: #555;">
                            Please click the button below to go to the update page:
                          </p>
                    
                          <p style="text-align: center; margin: 30px 0;">
                            <a onclick="${issendEmail = true}" href="https://blog-api-hxsk.onrender.com/updateAdminDetails.html"
                               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
                              Update Email
                            </a>
                          </p>
                    
                          <p style="font-size: 14px; color: #777;">
                            If the button doesn't work, copy and paste this link into your browser:
                          </p>
                    
                          <p style="font-size: 14px; word-break: break-word;">
                            <a onclick="${issendEmail = true}" href="https://blog-api-hxsk.onrender.com/updateAdminDetails.html" style="color: #007bff;">
                              https://blog-api-hxsk.onrender.com/updateAdminDetails.html
                            </a>
                          </p>
                    
                          <p style="margin-top: 30px; font-size: 12px; color: #999;">
                            This link will expire soon. If you did not request this update, please ignore this email.
                          </p>
                        </div>
                      </div>
             `;


        await sendEmail(adminUser.email, 'Update Admin details Email Notification', htmlContent);
        res.status(200).json({ message: 'Email sent successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error sending email" });
    }
}
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
        await blog.findByIdAndUpdate(id, { author, title, content }, { new: true });
        res.status(200).json({ message: "blog is update successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching blogs" });
    }
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    const { publicId } = req.body;

    try {
        const deletedBlog = await blog.findByIdAndDelete(id);
        const deletePost = await cloudinary.uploader.destroy(publicId);

        if (!deletedBlog && !deletePost) {
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
            return res.status(401).json({ massage: "only for admin", isAdmin: false });
        }

        const token = jwt.sign({ id: isAdmin._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
        //  console.log('token ', token);

        res.status(200)
            .cookie('blogAdminToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                // sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            })
            .json({ massage: 'you are admin . you can update our blog site', isAdmin });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching admin" });
    }

}

export const putAdmin = async (req, res) => {
    const { username, password, name, isrecieveEmail } = req.body;

    if (!issendEmail) {
        return res.status(400).json({ success: false, message: "Please send email to update your details" });
    }

    issendEmail = isrecieveEmail || false;

    try {
        await admin.findByIdAndUpdate(req.isAdmin_id,
            { username, password, name },
            { new: true });

        res.status(200).json({ success: true, massage: 'Admin details updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Error fetching admin" });
    }

}
export const forgetPasswordController = async (req, res) => {
    const { password, } = req.body;

    try {
        await admin.findByIdAndUpdate(req.isAdmin_id,
            { password },
            { new: true });

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Error fetching admin" });
    }

}

export const logoutAdmin = (req, res) => {
    res.clearCookie('blogAdminToken', 'forgetPasswordToken', {
        httpOnly: true,
        secure: true,
        // sameSite: 'lax'
        sameSite: 'none' // if you are using https then use 'none'
    });

    res.status(200).json({ message: 'Logout successful' });
};
