export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // strip off "data:*/*;base64," prefix
      const result = (reader.result as string).split(",", 2)[1];
      resolve(result);
    };
    reader.onerror = reject;
  });

export const fromBase64 = (base64: string): Uint8Array => {
  // Decode Base64 string to raw binary data
  const byteCharacters = atob(base64);

  // Convert raw binary data to an array of bytes
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Create a Uint8Array from the byte numbers
  return new Uint8Array(byteNumbers);
};
