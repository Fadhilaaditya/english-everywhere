/**
 * Optimizes a Cloudinary image URL by injecting dynamic transformation parameters.
 * 
 * @param url The original Cloudinary image URL
 * @param options Optimization options (width, height, crop, etc.)
 * @returns An optimized URL with f_auto,q_auto and optional resizing
 */
export const cloudinaryOptimize = (url: string | undefined, options: { width?: number, height?: number, crop?: string } = {}) => {
  if (!url) return '';
  
  // If not a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) return url;
  
  try {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    const baseUrl = parts[0];
    const imagePath = parts[1];
    
    // Default optimizations: auto format and auto quality
    const transforms = ['f_auto', 'q_auto'];
    
    // Map CSS-like terms to Cloudinary terms
    let cropMode = options.crop;
    if (cropMode === 'contain') cropMode = 'fit';
    if (cropMode === 'cover') cropMode = 'fill';

    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    
    if (cropMode) {
      transforms.push(`c_${cropMode}`);
    } else if (options.width || options.height) {
      transforms.push('c_limit');
    }
    
    return `${baseUrl}/upload/${transforms.join(',')}/${imagePath}`;
  } catch (error) {
    console.warn('Error optimizing Cloudinary URL:', error);
    return url;
  }
};
