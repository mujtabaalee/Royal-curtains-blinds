import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Trash2, Star, Edit2 } from 'lucide-react';
import styles from './ProductManager.module.css';

interface ProductItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  isFeatured: boolean;
  createdAt?: any;
}

const ProductManager = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Curtains');
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const fetchItems = async () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductItem[];
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || (!file && !currentImageUrl)) {
      alert("Please fill all required fields and select an image.");
      return;
    }

    setUploading(true);
    let uploadedImageUrl = currentImageUrl;
    try {
      if (file) {
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
        uploadedImageUrl = cloudinaryData.secure_url;
      }

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'products', currentId), {
          imageUrl: uploadedImageUrl,
          title,
          description,
          category,
          isFeatured
        });
      } else {
        await addDoc(collection(db, 'products'), {
          imageUrl: uploadedImageUrl,
          title,
          description,
          category,
          isFeatured,
          createdAt: serverTimestamp()
        });
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error creating/updating product: ", error);
      alert('Product operation failed');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('Curtains');
    setIsFeatured(false);
    setIsEditing(false);
    setCurrentId(null);
    setCurrentImageUrl('');
  };

  const handleEdit = (product: ProductItem) => {
    setTitle(product.title);
    setDescription(product.description);
    setCategory(product.category);
    setIsFeatured(product.isFeatured);
    setCurrentImageUrl(product.imageUrl);
    setCurrentId(product.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
      alert('Delete failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Product Catalog Manager</h2>
      </div>

      <div className={styles.uploadCard}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Product Image {!isEditing && '*'}</label>
            <input 
              type="file" 
              accept="image/*"
              className={styles.input} 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required={!isEditing} 
            />
            {isEditing && currentImageUrl && !file && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                Current image kept unless replaced.
              </div>
            )}
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title *</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. S-Wave Blockout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Category *</label>
            <select 
              className={styles.select} 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Curtains">Curtains</option>
              <option value="Blinds">Blinds</option>
              <option value="Shutters">Shutters</option>
            </select>
          </div>

          <div className={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              id="featured"
              className={styles.checkbox}
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <label htmlFor="featured" className={styles.label}>Show in Featured Section (Home)</label>
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Description *</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Technical specs and marketing copy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', gridColumn: '1 / -1' }}>
            {isEditing && (
              <button type="button" className={styles.cancelBtn} onClick={resetForm} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
            )}
            <button type="submit" className={styles.submitBtn} disabled={uploading || !title || !description || (!file && !currentImageUrl)} style={{ flex: 2 }}>
              {uploading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.grid}>
        {items.map(item => (
          <div key={item.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <img src={item.imageUrl} alt={item.title} className={styles.image} />
              <div className={styles.badges}>
                <span className={styles.badge}>{item.category}</span>
                {item.isFeatured && (
                  <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                    <Star size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className={styles.content}>
              <h3 className={styles.productTitle}>{item.title}</h3>
              <p className={styles.productDesc}>{item.description}</p>
              <div className={styles.actions}>
                <button 
                  className={styles.editBtn}
                  onClick={() => handleEdit(item)}
                  title="Edit product"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item.id)}
                  title="Delete product"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
