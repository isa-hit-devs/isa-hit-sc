import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
  uploadImageApi,
} from '../services/api';

export default function AdminPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'members'

  // Articles state
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postForm, setPostForm] = useState({ title: '', category: 'Tech Monday', description: '', image: '' });
  const [editingPostId, setEditingPostId] = useState(null);
  const [postUploading, setPostUploading] = useState(false);

  // Members state
  const [members, setMembers] = useState([]);
  const [memberLoading, setMemberLoading] = useState(true);
  const [memberForm, setMemberForm] = useState({ name: '', category: 'core-member', position: 'Web Developer', image: '' });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberUploading, setMemberUploading] = useState(false);

  // General Notification
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    loadPosts();
    loadMembers();
  }, [navigate]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const loadPosts = async () => {
    setPostLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      showMsg('error', 'Failed to load posts from server');
    } finally {
      setPostLoading(false);
    }
  };

  const loadMembers = async () => {
    setMemberLoading(true);
    try {
      const data = await fetchMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      showMsg('error', 'Failed to load members from server');
    } finally {
      setMemberLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Image Upload handler for Post
  const handlePostImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPostUploading(true);
    try {
      const res = await uploadImageApi(file);
      if (res.url) {
        setPostForm((prev) => ({ ...prev, image: res.url }));
        showMsg('success', 'Image uploaded successfully!');
      }
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to upload image');
    } finally {
      setPostUploading(false);
    }
  };

  // Submit Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.description || !postForm.image) {
      showMsg('error', 'Please fill in all required post fields');
      return;
    }

    try {
      if (editingPostId) {
        await updatePost(editingPostId, postForm);
        showMsg('success', 'Post updated successfully!');
      } else {
        await createPost(postForm);
        showMsg('success', 'Post created successfully!');
      }
      setPostForm({ title: '', category: 'Tech Monday', description: '', image: '' });
      setEditingPostId(null);
      loadPosts();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Action failed');
    }
  };

  // Edit Post
  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setPostForm({
      title: post.title,
      category: post.category || 'Tech Monday',
      description: post.description,
      image: post.image,
    });
  };

  // Delete Post
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await deletePost(id);
      showMsg('success', 'Post deleted!');
      loadPosts();
    } catch (err) {
      showMsg('error', 'Failed to delete post');
    }
  };

  // Image Upload handler for Member
  const handleMemberImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMemberUploading(true);
    try {
      const res = await uploadImageApi(file);
      if (res.url) {
        setMemberForm((prev) => ({ ...prev, image: res.url }));
        showMsg('success', 'Member photo uploaded successfully!');
      }
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setMemberUploading(false);
    }
  };

  // Submit Member
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.image) {
      showMsg('error', 'Please provide member name and image');
      return;
    }

    try {
      if (editingMemberId) {
        await updateMember(editingMemberId, memberForm);
        showMsg('success', 'Member updated successfully!');
      } else {
        await createMember(memberForm);
        showMsg('success', 'Member added successfully!');
      }
      setMemberForm({ name: '', category: 'core-member', position: 'Web Developer', image: '' });
      setEditingMemberId(null);
      loadMembers();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Action failed');
    }
  };

  // Edit Member
  const handleEditMember = (member) => {
    setEditingMemberId(member._id);
    setMemberForm({
      name: member.name,
      category: member.category,
      position: member.position,
      image: member.image,
    });
  };

  // Delete Member
  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await deleteMember(id);
      showMsg('success', 'Member deleted!');
      loadMembers();
    } catch (err) {
      showMsg('error', 'Failed to delete member');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              ISA Admin Portal
            </span>
            <span className="bg-blue-600/30 text-blue-300 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/30 font-semibold">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="/" className="text-xs font-semibold text-slate-300 hover:text-white transition">
              View Website →
            </a>
            {user && (
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                Signed in as <strong className="text-white">{user.name || user.email}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toast Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${message.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'articles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Tech Articles ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'members'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Chapter Members ({members.length})
          </button>
        </div>

        {/* TAB 1: TECH ARTICLES MANAGER */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {editingPostId ? 'Edit Article' : 'Add New Tech Article'}
              </h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600"
                    placeholder="Article title..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600 bg-white"
                  >
                    <option value="Tech Monday">Tech Monday</option>
                    <option value="Tech Photography">Tech Photography</option>
                    <option value="Walking Wednesday">Walking Wednesday</option>
                    <option value="Thought Thursday">Thought Thursday</option>
                    <option value="Quiz Friday">Quiz Friday</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Image URL or File</label>
                  <input
                    type="text"
                    required
                    value={postForm.image}
                    onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600 mb-2"
                    placeholder="https://image-url..."
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePostImageUpload}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {postUploading && <span className="text-xs text-blue-600 font-semibold">Uploading...</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                  <textarea
                    required
                    rows="4"
                    value={postForm.description}
                    onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600"
                    placeholder="Write article details..."
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-500/20"
                  >
                    {editingPostId ? 'Save Changes' : 'Create Article'}
                  </button>
                  {editingPostId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPostId(null);
                        setPostForm({ title: '', category: 'Tech Monday', description: '', image: '' });
                      }}
                      className="px-4 py-2.5 bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Published Articles</h2>
              {postLoading ? (
                <div className="py-12 text-center text-slate-500 text-sm">Loading articles...</div>
              ) : posts.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                  No tech articles found in database. Create one using the form.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                      <div>
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-36 w-full object-cover rounded-xl mb-3"
                          />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {post.category}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-1">{post.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{post.description}</p>
                      </div>

                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS MANAGER */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                {editingMemberId ? 'Edit Member' : 'Add Chapter Member'}
              </h2>
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600"
                    placeholder="Member full name..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    value={memberForm.category}
                    onChange={(e) => setMemberForm({ ...memberForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600 bg-white"
                  >
                    <option value="core-member">Core Member</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Position</label>
                  <select
                    value={memberForm.position}
                    onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600 bg-white"
                  >
                    <option value="President">President</option>
                    <option value="Vice-President">Vice-President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Joint-Secretary">Joint-Secretary</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Technical Member">Technical Member</option>
                    <option value="PR">PR</option>
                    <option value="Content Writer">Content Writer</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Video Editor">Video Editor</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Technical-Head">Technical-Head</option>
                    <option value="Content-Head">Content-Head</option>
                    <option value="PR-Head">PR-Head</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Media-Head">Media-Head</option>
                    <option value="GD-Head">GD-Head</option>
                    <option value="Manager">Manager</option>
                    <option value="Marketing-Head">Marketing-Head</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Photo URL or File</label>
                  <input
                    type="text"
                    required
                    value={memberForm.image}
                    onChange={(e) => setMemberForm({ ...memberForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-blue-600 mb-2"
                    placeholder="https://photo-url..."
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMemberImageUpload}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {memberUploading && <span className="text-xs text-blue-600 font-semibold">Uploading...</span>}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-500/20"
                  >
                    {editingMemberId ? 'Save Changes' : 'Add Member'}
                  </button>
                  {editingMemberId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMemberId(null);
                        setMemberForm({ name: '', category: 'core-member', position: 'Web Developer', image: '' });
                      }}
                      className="px-4 py-2.5 bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Chapter Members List</h2>
              {memberLoading ? (
                <div className="py-12 text-center text-slate-500 text-sm">Loading members...</div>
              ) : members.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                  No chapter members found. Add members using the form.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div key={member._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between items-center text-center">
                      <div className="w-full flex flex-col items-center">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-20 w-20 object-cover rounded-full border-2 border-blue-500 shadow-sm mb-2"
                        />
                        <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                        <p className="text-xs text-blue-600 font-semibold">{member.position}</p>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{member.category}</span>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 w-full justify-center">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
