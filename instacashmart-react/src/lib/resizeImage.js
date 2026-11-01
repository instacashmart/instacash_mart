export function resizeImage(t, e = 600) {
  return new Promise((s, n) => {
    const a = new FileReader();
    a.onload = () => {
      const r = new Image();
      r.onload = () => {
        const o = Math.min(1, e / Math.max(r.width, r.height));
        const l = document.createElement("canvas");
        l.width = Math.round(r.width * o);
        l.height = Math.round(r.height * o);
        l.getContext("2d").drawImage(r, 0, 0, l.width, l.height);
        s(l.toDataURL("image/jpeg", 0.8));
      };
      r.onerror = n;
      r.src = a.result;
    };
    a.onerror = n;
    a.readAsDataURL(t);
  });
}
