import React, { useState } from 'react';
import styles from './css/imageUploader.module.css';

function ImageUploaderLong({ label, shape = 'rectangle', onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file); // ✅ 選擇後回傳圖片到父層
    } 
  };

  return (
    <div className={styles.uploadBox + ' ' + styles[shape]}>
      <label className={styles.label}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className={styles.fileInput}
        />
        {preview ? (
          <img src={preview} alt="預覽" className={styles.preview} />
        ) : (
          <>
            <img src="/images/icons/img.png" alt="icon" className={styles.icon} />
            <p>上傳圖片</p>
          </>
        )}
      </label>
    </div>
  );
}

function ImageUploaderSquare({ label, shape = 'square', onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file); // ✅ 選擇後回傳圖片到父層
    }
  };

  return (
    <div className={styles.uploadBox + ' ' + styles[shape]}>
      <label className={styles.label}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className={styles.fileInput}
        />
        {preview ? (
          <img src={preview} alt="預覽" className={styles.preview} />
        ) : (
          <>
            <img src="/images/icons/img.png" alt="icon" className={styles.icon} />
            <p>上傳圖片</p>
          </>
        )}
      </label>
    </div>
  );
}

export default function ImageUploader({ onImagesSelect }) {
  // ✅ 收集兩張圖片
  const handleLongImageSelect = (file) => {
    onImagesSelect((prev) => {
      const newImages = [...prev];
      newImages[0] = file;
      return newImages;
    });
  };

  const handleSquareImageSelect = (file) => {
    onImagesSelect((prev) => {
      const newImages = [...prev];
      newImages[1] = file;
      return newImages;
    });
  };

  return (
    <div className={styles.ImageUploader}>
      <ImageUploaderLong onImageSelect={handleLongImageSelect} />
      <ImageUploaderSquare onImageSelect={handleSquareImageSelect} />
    </div>
  );
}
