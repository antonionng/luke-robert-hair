/**
 * IMAGE ROTATION SYSTEM
 * 
 * Manages brand image selection and rotation for blog posts.
 * Ensures fair distribution by cycling through all images before repeating.
 */

import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

// Map blog categories to image folders
const CATEGORY_TO_FOLDER_MAP: Record<string, string> = {
  'Education Insights': 'education',
  'Salon Tips': 'hair-styling',
  'Product Highlights': 'hair-styling',
  'barbering': 'barbering',
  'education': 'education',
  'hair-styling': 'hair-styling',
};

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export interface BrandImageInfo {
  path: string; // Relative path from public/ (e.g., /images/education/image.jpg)
  filename: string;
  category: string;
  usageCount: number;
  lastUsed: string | null;
}

/**
 * Get the image folder for a given category
 */
export function getImageFolderForCategory(category: string): string {
  const folderName = CATEGORY_TO_FOLDER_MAP[category] || 'hair-styling';
  return folderName;
}

/**
 * Get all brand images from a category folder
 * This runs server-side only (uses fs)
 */
export function getBrandImagesByCategory(category: string): string[] {
  const folderName = getImageFolderForCategory(category);
  const imagesDir = path.join(process.cwd(), 'public', 'images', folderName);

  // Check if directory exists
  if (!fs.existsSync(imagesDir)) {
    console.warn(`Image directory not found: ${imagesDir}`);
    return [];
  }

  try {
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    // Return as public-accessible paths
    return imageFiles.map(file => `/images/${folderName}/${file}`);
  } catch (error) {
    console.error(`Error reading image directory ${imagesDir}:`, error);
    return [];
  }
}

/**
 * Get image usage data from database
 */
async function getImageUsageData(imagePath: string): Promise<BrandImageInfo | null> {
  try {
    const { data, error } = await supabase
      .from('brand_image_usage')
      .select('*')
      .eq('image_path', imagePath)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned", which is OK
      console.error('Error fetching image usage:', error);
      return null;
    }

    if (data) {
      return {
        path: data.image_path,
        filename: path.basename(data.image_path),
        category: data.category,
        usageCount: data.usage_count || 0,
        lastUsed: data.last_used,
      };
    }

    return null;
  } catch (error) {
    console.error('Error in getImageUsageData:', error);
    return null;
  }
}

/**
 * Initialize image usage data if not exists
 */
async function initializeImageUsage(imagePath: string, category: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('brand_image_usage')
      .insert({
        image_path: imagePath,
        category,
        usage_count: 0,
        last_used: null,
      });

    if (error && error.code !== '23505') {
      // 23505 is unique constraint violation (already exists), which is OK
      console.error('Error initializing image usage:', error);
    }
  } catch (error) {
    console.error('Error in initializeImageUsage:', error);
  }
}

/**
 * Get the next brand image to use based on rotation (least recently used)
 */
export async function getNextBrandImage(category: string): Promise<string | null> {
  const images = getBrandImagesByCategory(category);

  if (images.length === 0) {
    console.log(`No brand images found for category: ${category}`);
    return null;
  }

  // Get usage data for all images
  const imageDataPromises = images.map(async (imagePath) => {
    let data = await getImageUsageData(imagePath);
    
    // If no usage data exists, initialize it
    if (!data) {
      await initializeImageUsage(imagePath, getImageFolderForCategory(category));
      data = {
        path: imagePath,
        filename: path.basename(imagePath),
        category: getImageFolderForCategory(category),
        usageCount: 0,
        lastUsed: null,
      };
    }
    
    return data;
  });

  const imageData = await Promise.all(imageDataPromises);

  // Sort by usage count (ascending), then by last_used (null first, then oldest first)
  const sortedImages = imageData.sort((a, b) => {
    // First priority: usage count (lower is better)
    if (a.usageCount !== b.usageCount) {
      return a.usageCount - b.usageCount;
    }

    // Second priority: last used (null first, then oldest first)
    if (a.lastUsed === null && b.lastUsed === null) return 0;
    if (a.lastUsed === null) return -1;
    if (b.lastUsed === null) return 1;
    
    return new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime();
  });

  // Return the least-recently-used image
  return sortedImages[0]?.path || images[0];
}

/**
 * Track that an image was used
 */
export async function trackImageUsage(imagePath: string): Promise<void> {
  try {
    // First, try to get existing record
    const { data: existing } = await supabase
      .from('brand_image_usage')
      .select('usage_count')
      .eq('image_path', imagePath)
      .maybeSingle();

    const newUsageCount = (existing?.usage_count || 0) + 1;

    // Upsert the usage data
    const { error } = await supabase
      .from('brand_image_usage')
      .upsert({
        image_path: imagePath,
        category: path.basename(path.dirname(imagePath)), // Extract category from path
        usage_count: newUsageCount,
        last_used: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'image_path'
      });

    if (error) {
      console.error('Error tracking image usage:', error);
    } else {
      console.log(`✅ Tracked usage for ${imagePath} (count: ${newUsageCount})`);
    }
  } catch (error) {
    console.error('Error in trackImageUsage:', error);
  }
}

/**
 * Reset image rotation for a category or all categories
 */
export async function resetImageRotation(category?: string): Promise<void> {
  try {
    if (category) {
      const folderName = getImageFolderForCategory(category);
      const { error } = await supabase
        .from('brand_image_usage')
        .update({
          usage_count: 0,
          last_used: null,
          updated_at: new Date().toISOString(),
        })
        .eq('category', folderName);

      if (error) {
        console.error(`Error resetting rotation for ${category}:`, error);
      } else {
        console.log(`✅ Reset rotation for category: ${category}`);
      }
    } else {
      // Reset all
      const { error } = await supabase
        .from('brand_image_usage')
        .update({
          usage_count: 0,
          last_used: null,
          updated_at: new Date().toISOString(),
        })
        .neq('image_path', ''); // Update all rows

      if (error) {
        console.error('Error resetting all rotations:', error);
      } else {
        console.log('✅ Reset rotation for all categories');
      }
    }
  } catch (error) {
    console.error('Error in resetImageRotation:', error);
  }
}

/**
 * Get statistics about image usage for a category
 */
export async function getImageRotationStats(category?: string): Promise<{
  totalImages: number;
  averageUsage: number;
  leastUsed: BrandImageInfo | null;
  mostUsed: BrandImageInfo | null;
}> {
  try {
    let query = supabase.from('brand_image_usage').select('*');

    if (category) {
      const folderName = getImageFolderForCategory(category);
      query = query.eq('category', folderName);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return {
        totalImages: 0,
        averageUsage: 0,
        leastUsed: null,
        mostUsed: null,
      };
    }

    const images: BrandImageInfo[] = data.map(d => ({
      path: d.image_path,
      filename: path.basename(d.image_path),
      category: d.category,
      usageCount: d.usage_count || 0,
      lastUsed: d.last_used,
    }));

    const totalUsage = images.reduce((sum, img) => sum + img.usageCount, 0);
    const averageUsage = totalUsage / images.length;

    const sorted = [...images].sort((a, b) => a.usageCount - b.usageCount);

    return {
      totalImages: images.length,
      averageUsage: Math.round(averageUsage * 100) / 100,
      leastUsed: sorted[0] || null,
      mostUsed: sorted[sorted.length - 1] || null,
    };
  } catch (error) {
    console.error('Error in getImageRotationStats:', error);
    return {
      totalImages: 0,
      averageUsage: 0,
      leastUsed: null,
      mostUsed: null,
    };
  }
}

