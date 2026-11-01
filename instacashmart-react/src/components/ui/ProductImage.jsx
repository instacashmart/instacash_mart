import { useEffect, useState } from "react";

export function ProductImage({ product, boxClass, iconClass }) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [product.image]);
  if (product.image && !imageFailed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={`${boxClass} object-cover`}
        onError={() => setImageFailed(true)}
      />
    );
  }
  return (
    <span className={`${boxClass} flex items-center justify-center bg-slate-100 text-slate-900`}>
      <i className={`fa-solid ${product.icon || "fa-image"} ${iconClass}`} />
    </span>
  );
}
