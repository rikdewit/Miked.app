const IMAGE_STORE_KEY = 'tiptap_images';
const IMAGE_ID_PREFIX = 'img_';

interface StoredImage {
  id: string;
  data: string;
  timestamp: number;
}

export const imageStorage = {
  // Store an image and return its ID
  storeImage: (imageData: string): string => {
    const id = `${IMAGE_ID_PREFIX}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const store = JSON.parse(localStorage.getItem(IMAGE_STORE_KEY) || '{}');
    store[id] = {
      id,
      data: imageData,
      timestamp: Date.now(),
    };
    localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(store));
    return id;
  },

  // Retrieve an image by ID
  getImage: (id: string): string | null => {
    const store = JSON.parse(localStorage.getItem(IMAGE_STORE_KEY) || '{}');
    return store[id]?.data || null;
  },

  // Get all stored images
  getAllImages: (): Record<string, StoredImage> => {
    return JSON.parse(localStorage.getItem(IMAGE_STORE_KEY) || '{}');
  },

  // Delete an image
  deleteImage: (id: string): void => {
    const store = JSON.parse(localStorage.getItem(IMAGE_STORE_KEY) || '{}');
    delete store[id];
    localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(store));
  },

  // Clear all images
  clearAll: (): void => {
    localStorage.removeItem(IMAGE_STORE_KEY);
  },

  // Clean up old images (older than 7 days)
  cleanupOldImages: (): void => {
    const store = JSON.parse(localStorage.getItem(IMAGE_STORE_KEY) || '{}');
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    Object.keys(store).forEach(id => {
      if (store[id].timestamp < sevenDaysAgo) {
        delete store[id];
      }
    });

    localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(store));
  },
};
