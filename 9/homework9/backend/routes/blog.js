import express from "express";

import {BlogModel} from "../schema/blog.js";

const router = express.Router();

/* GET users listing. */
router.get("/", async (req, res, next) => {
	// find blogs based on no condition==> get all blogs
	const blogs = await BlogModel.find({});
	// convert each blog to an object and send an array to client
	return res.send(blogs.map((blog) => blog.toObject()));
});

router.post("/create-post", async (req, res) => {
	// body should be JSON
	const body = req.body;
	// create blog model with the request body
	const blog = new BlogModel({content: body.content, title: body.title});
	// remember to await .save();
	// attempt to save to mongodb
	await blog.save(function(error) {// inspiration for this implementation came from https://stackoverflow.com/a/71503963
		if (error) {
			if ( error.name === "MongoServerError" && error.code === 11000 ) {
				return res.send({ success : "false" })
			} else {
				res.send(err)
			}
		}
		// get an object representation and send it back to the client
		return res.send(blog.toObject());
	});
});

export default router;
