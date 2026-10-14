// Browser-only preparation. The server independently validates and recodes JPEG.
export async function preparePhoto(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type))
    throw new Error(
      "Usa una fotografía JPG, PNG, WebP o una foto compatible de tu teléfono.",
    );
  if (file.size > 8 * 1024 * 1024)
    throw new Error("La fotografía debe pesar menos de 8 MB.");
  let image: ImageBitmap | HTMLImageElement;
  let objectUrl: string | undefined;
  try {
    try {
      image = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      objectUrl = URL.createObjectURL(file);
      image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(
            new Error(
              "Tu navegador no puede leer esta foto. Elige JPG o toma una foto nueva.",
            ),
          );
        img.src = objectUrl!;
      });
    }
    const width =
      image instanceof HTMLImageElement ? image.naturalWidth : image.width;
    const height =
      image instanceof HTMLImageElement ? image.naturalHeight : image.height;
    if (!width || !height || width * height > 30_000_000)
      throw new Error("La fotografía es demasiado grande. Prueba otra.");
    const scale = Math.min(1, 1600 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No pudimos preparar la fotografía.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if ("close" in image) image.close();
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) =>
          b
            ? resolve(b)
            : reject(new Error("No pudimos preparar la fotografía.")),
        "image/jpeg",
        0.78,
      ),
    );
    if (blob.size > 1048576)
      throw new Error("Prueba una fotografía más pequeña.");
    return new File([blob], "foto.jpg", { type: "image/jpeg" });
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
