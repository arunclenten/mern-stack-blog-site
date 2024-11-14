const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const UserModel = require("./Models/UserModel");
const PostModel = require("./Models/PostModel");
const ContactModel=require("./Models/ContactModel")

const app = express();
// Middleware to serve static files from 'Public'
app.use("/Public", express.static("Public"));



app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  app.get('/get-author-data', async (req, res) => {
    try {
      // Extract the token from the authorization header
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your actual JWT secret
  
      const userEmail = decoded.email;
  
      // Fetch user data based on email
      const user = await UserModel.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Query for user's posts
      const postCount = await PostModel.countDocuments({ authorEmail: userEmail });
  
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
  
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
  
      const todayPostCount = await PostModel.countDocuments({
        authorEmail: userEmail,
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });
  
      // Send the response with counts
      res.json({
        postCount,
        todayPostCount,
      });
    } catch (err) {
      console.error('Error in /get-author-data:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  



const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("the token is missing ");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        returnres.json("the tokwn is wrong");
      } else {
        req.email = decoded.email;
        req.username = decoded.username;
        next();
      }
    });
  }
};
app.get("/", verifyUser, (req, res) => {
  return res.json({ email: req.email, username: req.username });
});



app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ username, email, password: hash })
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, username: user.username },
            "jwt-secret-key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json("success");
        } else {
          return res.json("password is incorrect");
        }
      });
    } else {
      res.json("user not exist");
    }
  });
});

// postmodel upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// blog create file

app.post("/create", verifyUser, upload.single("file"), (req, res) => {
  console.log(req.file);
  PostModel.create({
    title: req.body.title,
    description: req.body.description,
    file: req.file.filename,
    email:req.body.email
  })
    .then((result) => res.json("success"))
    .catch((err) => res.json(err));
});

app.put("/editpost/:id", (req, res) => {
  const id = req.params.id;
  PostModel.findByIdAndUpdate({
    _id: id},
    {title: req.body.title,
    description: req.body.description,
  })
  .then(result => res.json("success"))
  .catch(err => res.json(err))
});

app.get("/getposts", (req, res) => {
  PostModel.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.json(err));
});

app.get("/getpostbyid/:id", (req, res) => {
  const id = req.params.id;
  PostModel.findById({ _id: id })
    .then((post) => res.json(post))
    .catch((err) => console.log(err));
});
app.delete('/deletepost/:id',(req,res) =>{
  PostModel.findByIdAndDelete({_id:req.params.id})
  .then(result =>res.json("success"))
  .catch(err => res.json(err))
})

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json("success");
});

// Contact form submission
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newContact = new ContactModel({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    res.status(200).json({ message: "Contact submitted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "There was an error submitting your contact." });
  }
});

// Endpoint to get all contact submissions
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await ContactModel.find(); // Use the Contact model to query the 'contacts' collection
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching data:', error); // Optional: log error details
    res.status(500).json({ message: 'Error fetching data', error });
  }
});


// Update contact
app.put('/contacts/:id', async (req, res) => {
  try {
    const contact = await ContactModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error });
  }
});

// Delete contact
app.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await ContactModel.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});