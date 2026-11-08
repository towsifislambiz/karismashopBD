/**
 * Karishma Shop BD — Universal Client-Side Image WebP Converter & Optimizer
 * Converts any uploaded image (PNG, JPG, HEIC, WEBP) to highly-optimized WebP
 * Automatically resizes giant camera photos (e.g. 10MB) to optimal e-commerce resolution.
 */

export async function convertToWebP(fileOrBlob, options = {}) {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82
  } = options;

  if (!fileOrBlob) {
    throw new Error('No image file provided for conversion');
  }

  const originalSize = fileOrBlob.size || 0;
  const originalName = fileOrBlob.name || 'image';
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed reading file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed loading image into memory'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional resize if larger than maximum boundaries
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D context not available'));
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob conversion failed'));
            }

            const webpFileName = `${baseName}.webp`;
            const webpFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            const dataUrl = canvas.toDataURL('image/webp', quality);
            const optimizedSize = blob.size;
            const savedBytes = Math.max(0, originalSize - optimizedSize);
            const savedPercent = originalSize > 0
              ? Math.round((savedBytes / originalSize) * 100)
              : 0;

            resolve({
              file: webpFile,
              blob,
              dataUrl,
              fileName: webpFileName,
              originalSize,
              optimizedSize,
              savedPercent,
              dimensions: { width, height }
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Helper to process an <input type="file"> event and return WebP files
 */
export async function processUploadInput(fileList, options = {}) {
  const files = Array.from(fileList || []);
  const results = [];

  for (const f of files) {
    if (f.type.startsWith('image/')) {
      const optimized = await convertToWebP(f, options);
      results.push(optimized);
    }
  }

  return results;
}
