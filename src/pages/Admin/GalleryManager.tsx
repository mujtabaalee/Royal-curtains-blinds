import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Trash2 } from 'lucide-react';
import styles from './GalleryManager.module.css';

interface GalleryItem {
  id: string;
  url: string;
  genre: string;
  storageRef: string;
  title: string;
}

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Curtains');
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    const q = query(collection(db, 'gallery_images'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryItem[];
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      // Setup Cloudinary POST Request
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error("Cloudinary upload failed");

      const cloudinaryData = await response.json();
      const url = cloudinaryData.secure_url;

      // Save to Firestore
      await addDoc(collection(db, 'gallery_images'), {
        url,
        genre,
        title,
        storageRef: 'cloudinary', // Obsolete metadata
        createdAt: serverTimestamp()
      });

      setFile(null);
      setTitle('');
      fetchItems();
    } catch (error) {
      console.error("Error uploading: ", error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!window.confirm('Delete this image?')) return;
    
    try {
      // Removing document reference from Firestore database
      // The actual Cloudinary image remains on their server, which is fine!
      await deleteDoc(doc(db, 'gallery_images', id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting: ", error);
      alert('Delete failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dynamic Gallery</h2>
      </div>

      <div className={styles.uploadCard}>
        <form onSubmit={handleUpload} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Image File</label>
            <input 
              type="file" 
              accept="image/*"
              className={styles.input} 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title (Optional)</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Sheer Elegance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Genre Tag</label>
            <select 
              className={styles.select} 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="Curtains">Curtains</option>
              <option value="Blinds">Blinds</option>
              <option value="Shutters">Shutters</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={uploading || !file}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      <div className={styles.grid}>
        {items.map(item => (
          <div key={item.id} className={styles.imageCard}>
            <img src={item.url} alt={item.title} className={styles.image} />
            <div className={styles.overlay}>
              <span className={styles.genreBadge}>{item.genre}</span>
              <button 
                className={styles.deleteBtn}
                onClick={() => handleDelete(item.id, item.storageRef)}
                title="Delete image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
