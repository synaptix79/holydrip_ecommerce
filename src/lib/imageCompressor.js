/**
 * Comprime una imagen en el frontend usando Canvas antes de subirla a Storage.
 * - Input máximo: 5MB
 * - Output objetivo: 300KB–700KB
 * - Output máximo: 1MB (si no puede, bloquea)
 */
const MAX_INPUT_BYTES = 5 * 1024 * 1024;   // 5MB input
const MAX_OUTPUT_BYTES = 1 * 1024 * 1024;   // 1MB output final

export const compressImage = (file, { maxWidthOrHeight = 1200, quality = 0.75 } = {}) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      return resolve({ blob: null, error: `${file.name} no es una imagen válida.` });
    }
    if (file.size > MAX_INPUT_BYTES) {
      return resolve({ blob: null, error: `${file.name} supera el límite de 5MB. Usá una imagen más liviana.` });
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Escalar manteniendo ratio
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Primer intento: calidad 0.75
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve({ blob: null, error: `No se pudo comprimir ${file.name}.` });

            if (blob.size <= MAX_OUTPUT_BYTES) {
              return resolve({ blob, error: null });
            }

            // Segundo intento: calidad más baja (0.50)
            canvas.toBlob(
              (blob2) => {
                if (!blob2) return resolve({ blob: null, error: `No se pudo comprimir ${file.name}.` });

                if (blob2.size <= MAX_OUTPUT_BYTES) {
                  return resolve({ blob: blob2, error: null });
                }

                // Tercer intento: calidad 0.35 + reducir resolución
                const smallCanvas = document.createElement('canvas');
                const scale = 0.7;
                smallCanvas.width = Math.round(width * scale);
                smallCanvas.height = Math.round(height * scale);
                const ctx2 = smallCanvas.getContext('2d');
                ctx2.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);

                smallCanvas.toBlob(
                  (blob3) => {
                    if (!blob3 || blob3.size > MAX_OUTPUT_BYTES) {
                      return resolve({
                        blob: null,
                        error: `${file.name} sigue siendo mayor a 1MB después de comprimir. Usá una imagen más pequeña.`
                      });
                    }
                    resolve({ blob: blob3, error: null });
                  },
                  'image/jpeg',
                  0.35
                );
              },
              'image/jpeg',
              0.50
            );
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve({ blob: null, error: `No se pudo leer ${file.name}.` });
    };

    reader.onerror = () => resolve({ blob: null, error: `Error al leer ${file.name}.` });
  });
};
