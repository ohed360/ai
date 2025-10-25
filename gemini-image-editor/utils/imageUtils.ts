
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result is a data URL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
      const parts = result.split(',');
      if (parts.length !== 2) {
        return reject(new Error('Invalid data URL format'));
      }
      
      const header = parts[0];
      const base64 = parts[1];

      const mimeTypeMatch = header.match(/:(.*?);/);
      if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
        return reject(new Error('Could not determine MIME type from data URL'));
      }
      const mimeType = mimeTypeMatch[1];
      
      resolve({ base64, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};
