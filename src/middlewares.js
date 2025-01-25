import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
	region: "ap-northeast-2",
	credentials: {
		accessKeyId: process.env.AWS_KEY,
		secretAccessKey: process.env.AWS_SECRET,
	},
	logger: console,
});

const s3AvatarStorage = multerS3({
	s3: s3Client,
	bucket: "wetube-fly-2025-soba",
	acl: "public-read",
	key: function (req, file, cb) {
	  cb(null, `avatars/${req.session.user._id}/${Date.now().toString()}`);
	},
	contentType: multerS3.AUTO_CONTENT_TYPE
  });

  const s3VideoStorage = multerS3({
	s3: s3Client,
	bucket: "wetube-fly-2025-soba",
	acl: "public-read",
	key: function (req, file, cb) {
	  cb(null, `videos/${req.session.user._id}/${Date.now().toString()}`);
	},
  });

export const localsMiddleware = (req, res, next) => {
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = "Wetube";
	res.locals.loggedInUser = req.session.user;
	res.locals.messages = req.flash();
	next();
};

export const protectorMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
	  return next();
	} else {
		req.flash("error", "Log in first.");
		return res.redirect("/login");
	}
  };

  export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
	  return next();
	} else {
		req.flash("error", "Not authorized");
		return res.redirect("/");
	}
  };

  export const avatarUpload = multer({
	limits: {
	fieldSize: 3000000,
	},
	storage: s3AvatarStorage,
});
  export const videoUpload = multer({
	limits: {
	fileSize: 15000000,
	},
	storage: s3VideoStorage,
});