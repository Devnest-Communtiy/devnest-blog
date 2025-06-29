const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
// Middleware


app.use(cors({ origin: '*' })); // Adjust the origin as needed

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB connection
mongoose.connect('mongodb+srv://armanmondal:armanmondal@cluster0.uc5ra2q.mongodb.net/devnest?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Blog Post Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  image: String,
  eventDate: Date,
  registrationLink: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogSchema);

const adminSchema= new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Admin = mongoose.model('Admins', adminSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Routes

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.admin = decoded;
    next();
    });
};



// Get all blog posts
app.get('/api/blogs', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/auth',authenticate, (req, res) => {
    res.status(200).json({ message: 'Authenticated', admin: req.admin });
});
app.post('/api/admins', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '4h' });
        const admin = new Admin({ username,password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin created successfully',token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Admin login
app.post('/api/admins/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const admin = await Admin.find({ username });
        if (!admin || admin.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '4h' });

        res.json({ message: 'Login successful', admin: { username: admin[0].username, id: admin[0]._id,token } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single blog post
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new blog post
app.post('/api/blogs', upload.single('image'), async (req, res) => {
  try {
    const blogData = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      registrationLink: req.body.registrationLink || ''
    };
    
    if (req.body.eventDate) {
      blogData.eventDate = new Date(req.body.eventDate);
    }
    
    if (req.file) {
      blogData.image = req.file.filename;
    }
    
    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update blog post
app.put('/api/blogs/:id',authenticate, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      registrationLink: req.body.registrationLink || '',
      updatedAt: new Date()
    };
    
    if (req.body.eventDate) {
      updateData.eventDate = new Date(req.body.eventDate);
    }
    
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete blog post
app.delete('/api/blogs/:id', authenticate,async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Delete associated image file
    if (blog.image) {
      const imagePath = path.join(__dirname, 'uploads', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Serve static files from the client/dist directory
app.use('/',express.static(path.join(__dirname, '../client', 'dist')));
app.use('/login',express.static(path.join(__dirname, '../client', 'dist')));

// Serve index.html for all unmatched routes (for SPA support)


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;