import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import styles from './BlogManager.module.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  imageUrl?: string;
  createdAt: any;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', metaTitle: '', metaDescription: '', content: '', imageUrl: ''
  });

  const fetchPosts = async () => {
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let uploadedImageUrl = formData.imageUrl;

    try {
      if (file) {
        // Upload to Cloudinary
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: fileData
        });

        if (!response.ok) throw new Error("Cloudinary upload failed");

        const cloudinaryData = await response.json();
        uploadedImageUrl = cloudinaryData.secure_url;
      }

      if (currentId) {
        await updateDoc(doc(db, 'blog_posts', currentId), {
          ...formData,
          imageUrl: uploadedImageUrl
        });
      } else {
        await addDoc(collection(db, 'blog_posts'), {
          ...formData,
          imageUrl: uploadedImageUrl,
          createdAt: serverTimestamp()
        });
      }
      
      setFormData({ title: '', slug: '', metaTitle: '', metaDescription: '', content: '', imageUrl: '' });
      setFile(null);
      setIsEditing(false);
      setCurrentId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post: ", error);
      alert("Failed to save post.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      content: post.content,
      imageUrl: post.imageUrl || ''
    });
    setFile(null);
    setCurrentId(post.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    await deleteDoc(doc(db, 'blog_posts', id));
    fetchPosts();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Blog Manager</h2>
        {!isEditing && (
          <button className={styles.btnPrimary} onClick={() => setIsEditing(true)}>
            <Plus size={18} style={{ display: 'inline', marginRight: '0.5rem', marginBottom: '-4px' }} />
            New Post
          </button>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editorCard}>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Post Title</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, title, slug: formData.slug || slug });
                  }}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>URL Slug</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>SEO Meta Title</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>SEO Meta Description</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Cover Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className={styles.input} 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {formData.imageUrl && !file && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                    Current image will be kept unless replaced.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Post Content</label>
              <div className={styles.editorWrapper}>
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={styles.cancelBtn} onClick={() => {
                setIsEditing(false);
                setFormData({ title: '', slug: '', metaTitle: '', metaDescription: '', content: '', imageUrl: '' });
                setFile(null);
                setCurrentId(null);
              }}>
                Cancel
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={uploading}>
                {uploading ? 'Saving...' : currentId ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>/{post.slug}</td>
                  <td>{post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Draft'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} onClick={() => handleEdit(post)}>
                        <Edit2 size={16} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(post.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
