// AutoImg.jsx
import React, { useState, useRef, useEffect } from 'react';

// 把默认 extensions 提到外面，保证引用稳定
const DEFAULT_EXTS = ['jpg','png','jpeg','webp'];

function AutoImg({
  src: basePath,
  exts = DEFAULT_EXTS,
   alt = '', 
  ...imgProps
}) {
  const [currentSrc, setCurrentSrc] = useState(`${basePath}.${exts[0]}`);
  const idxRef = useRef(0);

  // 仅在 basePath 变化时才重置
  useEffect(() => {
    idxRef.current = 0;
    setCurrentSrc(`${basePath}.${exts[0]}`);
  }, [basePath,exts]);

  const handleError = () => {
    const next = idxRef.current + 1;
    if (next < exts.length) {
      idxRef.current = next;
      setCurrentSrc(`${basePath}.${exts[next]}`);
    }
  };

  return <img {...imgProps} src={currentSrc} onError={handleError} alt={alt}    />;
}

export default AutoImg;
