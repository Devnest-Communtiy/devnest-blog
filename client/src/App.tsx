import  { useState, useEffect } from 'react';
import { Search, Calendar, User, Plus, Edit, Trash2, ExternalLink, Filter, LogOut, XCircle } from 'lucide-react';
import './App.css'; // Import your custom styles
import { useAuth } from './AuthWrap';
const API_BASE = 'http://localhost:5050/api';

function App() {
  type BlogType = {
    _id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    eventDate?: string;
    registrationLink?: string;
    image?: string;
    createdAt?: string;
    [key: string]: any;
  };

  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);


  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);
  const {isAuthenticated}=useAuth();
  // Form state
  type FormDataState = {
    title: string;
    content: string;
    author: string;
    category: string;
    tags: string;
    eventDate: string;
    registrationLink: string;
    image: File | null;
  };

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    eventDate: '',
    registrationLink: '',
    image: null
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(6),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`${API_BASE}/blogs?${params}`);
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      setCategories(['all', ...data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        const typedKey = key as keyof FormDataState;
        if (formData[typedKey] !== null && formData[typedKey] !== '') {
          formDataToSend.append(key, formData[typedKey] as any);
        }
      });

      const url = editingBlog 
        ? `${API_BASE}/blogs/${editingBlog._id}`
        : `${API_BASE}/blogs`;
      
      const method = editingBlog ? 'PUT' : 'POST';

      await fetch(url, {
        headers:{
          'Authorization': sessionStorage.getItem('token') || ''
        },
        method,
        body: formDataToSend
      });

      setShowCreateForm(false);
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        author: '',
        category: '',
        tags: '',
        eventDate: '',
        registrationLink: '',
        image: null
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleDelete = async (id:any) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE', headers:{
          'Authorization': sessionStorage.getItem('token') || ''
        }, });
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleEdit = (blog:BlogType) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(', '),
      eventDate: blog.eventDate ? blog.eventDate.split('T')[0] : '',
      registrationLink: blog.registrationLink || '',
      image: null
    });
    setShowCreateForm(true);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const BlogCard = ({ blog }:{blog:any}) => (
    <div 
    style={{
      background: 'linear-gradient(to bottom right, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05))',
    }}
    className=" rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-green-800/20 bg-gray-900/90 text-white">
      
      {blog.image && (
        <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 relative overflow-hidden">
          <img 
            src={`${API_BASE.replace('/api', '')}/uploads/${blog.image}`}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {blog.category}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 hover:text-green-600 transition-colors cursor-pointer"
            onClick={() => setSelectedBlog(blog)}>
          {blog.title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-3">
          {blog.content.substring(0, 150)}...
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-200  mb-4">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag:string, index:number) => (
              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setSelectedBlog(blog)}
            className="text-green-600 hover:text-green-800 font-medium text-sm"
          >
            Read More
          </button>
          { isAuthenticated && (  
          <div className="flex gap-2">
             
            <button 
              onClick={() => handleEdit(blog)}
              className="p-2 text-gray-200 hover:text-green-600 transition-colors"
            >
              <Edit size={16} />
            </button>
      
             <button 
              onClick={() => handleDelete(blog._id)}
              className="p-2 text-gray-200 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
         
          </div>
          )}
        </div>
      </div>
    </div>
  );

  const BlogModal = () => {
    if (!selectedBlog) return null;
    return (
      <div
        style={{
          background: 'linear-gradient(to bottom right, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05))',
        }}
        className="fixed transition-all inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedBlog(null)}
      >
        <div
          style={{
            background: 'linear-gradient(to bottom right, rgb(2, 33, 2), rgb(2, 29, 2))',
          }}
          className="bg-black rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto relative
            transition-all duration-300 ease-out
            scale-95 opacity-0 animate-[modalIn_0.3s_ease-out_forwards]"
          onClick={e => e.stopPropagation()}
        >
          {/* Animated grid and background elements */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
          <div className="absolute top-20 left-20 w-32 h-32 border border-green-500/20 rounded-full animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-40 right-32 w-24 h-24 border border-green-400/30 rounded-full animate-bounce pointer-events-none"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-green-500/10 rounded-lg animate-ping pointer-events-none"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedBlog?.title ?? ''}</h2>
              <button
                onClick={() => setSelectedBlog(null)}
                className="text-gray-200 cursor-pointer hover:text-gray-700 text-2xl"
                aria-label="Close"
              >
                <XCircle size={24} />
              </button>
            </div>

            {selectedBlog.image && (
              <img
                src={`${API_BASE.replace('/api', '')}/uploads/${selectedBlog.image}`}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="flex items-center gap-4 text-sm text-gray-200 mb-6">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{selectedBlog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(selectedBlog.createdAt)}</span>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {selectedBlog.category}
              </span>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {selectedBlog.content}
              </p>
            </div>

            {selectedBlog.eventDate && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-green-800 mb-2">Event Details</h4>
                <p className="text-green-700">Date: {formatDate(selectedBlog.eventDate)}</p>
                {selectedBlog.registrationLink && (
                  <a
                    href={selectedBlog.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-green-600 hover:text-green-800"
                  >
                    Register Here <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}

            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedBlog.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Tailwind custom animation for modal */}
        <style>
          {`
            @keyframes modalIn {
              0% { opacity: 0; transform: scale(0.95);}
              100% { opacity: 1; transform: scale(1);}
            }
          `}
        </style>
      </div>
    );
  };

  return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, rgb(1, 14, 1), rgb(2, 29, 2))',
        }}
      >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-green-500/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-32 w-24 h-24 border border-green-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-green-500/10 rounded-lg animate-ping"></div>
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-gray-900/70 shadow-sm border-b border-green-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  dev<span className="text-green-600">nest</span>
                  <span className="text-green-500 text-4xl">.</span>
                </h1>
              </div>
              {isAuthenticated && (
                <div className='flex flex-row gap-5' >
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">New Post</span>
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('token');
                      window.location.reload();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-green-700 bg-black text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-green-700 bg-black text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {blogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === index + 1
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-900 text-green-400 hover:bg-green-900'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {/* ...rest of your modals and forms, update their backgrounds to bg-gray-900/90 or bg-black/90 and text to text-white as needed */}
        

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBlog ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingBlog(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                      <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Contest, Event, Tutorial"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="javascript, python, hackathon"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Date (optional)</label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files && e.target.files[0] ? e.target.files[0] : null})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link (optional)</label>
                    <input
                      type="url"
                      value={formData.registrationLink}
                      onChange={(e) => setFormData({...formData, registrationLink: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      {editingBlog ? 'Update Post' : 'Create Post'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingBlog(null);
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && <BlogModal />}
    </div>
    </div>
  );
}

export default App;