// fileUtils.js - File and image utility functions

/**
 * Convert Base64 data URL (from webcam) to a File object
 * @param {string} dataurl - Base64 data URL (e.g., "data:image/jpeg;base64,...")
 * @param {string} filename - Name for the resulting file
 * @returns {File} - File object ready for upload
 */
export const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

