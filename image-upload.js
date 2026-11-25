/* Image upload helper: compresses images and stores them as Data URLs in Local Storage. */
window.ImageUpload = (() => {
  function bind(fileInputId, previewId, hiddenInputId, maxMB = 1) {
    const input = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);
    const hidden = document.getElementById(hiddenInputId);
    if (!input || !preview || !hidden) return;
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) { alert("Please select an image file."); input.value = ""; return; }
      if (file.size > 10 * 1024 * 1024) { alert("Choose an image smaller than 10 MB."); input.value = ""; return; }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSide = 1400; let w = img.width, h = img.height;
          if (w > maxSide || h > maxSide) { const scale = Math.min(maxSide / w, maxSide / h); w = Math.round(w * scale); h = Math.round(h * scale); }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          let quality = 0.82, data = canvas.toDataURL("image/jpeg", quality);
          while (data.length > maxMB * 1024 * 1024 * 1.37 && quality > 0.45) { quality -= 0.08; data = canvas.toDataURL("image/jpeg", quality); }
          hidden.value = data; preview.innerHTML = `<img src="${data}" alt="Image preview">`;
        };
        img.onerror = () => alert("Could not read this image. Please choose another.");
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  return { bind };
})();
