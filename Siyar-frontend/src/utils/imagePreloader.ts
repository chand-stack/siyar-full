// Utility for preloading critical images
export class ImagePreloader {
  private static preloadedImages = new Set<string>();

  /**
   * Preload a critical image and add it to the document head
   */
  static preloadCriticalImage(src: string, as: 'image' = 'image'): void {
    if (this.preloadedImages.has(src)) {
      return; // Already preloaded
    }

    try {
      // Add preload link to document head
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = as;
      link.href = src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);

      this.preloadedImages.add(src);
      console.log(`🚀 Critical image preload added: ${src}`);
    } catch (error) {
      console.warn('Failed to add preload link:', error);
    }
  }

  /**
   * Preload multiple images with different priorities
   */
  static async preloadImages(
    images: Array<{ src: string; priority: 'high' | 'low' }>
  ): Promise<string[]> {
    const promises = images.map(({ src, priority }) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          console.log(`✅ Image loaded (${priority}): ${src.split('/').pop()}`);
          resolve(src);
        };
        
        img.onerror = () => {
          console.warn(`❌ Image failed to load: ${src.split('/').pop()}`);
          reject(new Error(`Failed to load ${src}`));
        };

        // Set loading attributes based on priority
        if (priority === 'high') {
          img.setAttribute('fetchpriority', 'high');
          img.loading = 'eager';
        } else {
          img.setAttribute('fetchpriority', 'low');
          img.loading = 'lazy';
        }
        
        img.src = src;
      });
    });

    try {
      const results = await Promise.allSettled(promises);
      const successful = results
        .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
        .map(result => result.value);
      
      console.log(`✅ Preloaded ${successful.length}/${images.length} images`);
      return successful;
    } catch (error) {
      console.warn('Image preloading error:', error);
      return [];
    }
  }

  /**
   * Create optimized image element with performance attributes
   */
  static createOptimizedImage(
    src: string, 
    alt: string, 
    priority: 'high' | 'low' = 'low'
  ): HTMLImageElement {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    img.loading = priority === 'high' ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.setAttribute('fetchpriority', priority);
    
    return img;
  }
}

// Export default instance
export const imagePreloader = ImagePreloader;
