/**
 * Media Domain - Core Entities
 *
 * This file defines core types and interfaces for media operations.
 * Handles images, videos, and media library interactions.
 *
 * NOTE: File operations are in @umituz/react-native-filesystem (no duplication)
 */

/**
 * Media type enumeration
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  ALL = 'all',
}

/**
 * Image format enumeration
 */
export enum ImageFormat {
  PNG = 'png',
  JPEG = 'jpeg',
  WEBP = 'webp',
}

/**
 * Media quality enumeration
 */
export enum MediaQuality {
  LOW = 0.3,
  MEDIUM = 0.7,
  HIGH = 1.0,
}

/**
 * Image dimensions interface
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Image manipulation actions
 */
export interface ImageManipulationActions {
  resize?: ImageDimensions;
  crop?: {
    originX: number;
    originY: number;
    width: number;
    height: number;
  };
  rotate?: number;
  flip?: {
    horizontal?: boolean;
    vertical?: boolean;
  };
}

/**
 * Image save options
 */
export interface ImageSaveOptions {
  quality?: MediaQuality;
  format?: ImageFormat;
  base64?: boolean;
}

/**
 * Media picker options
 */
export interface MediaPickerOptions {
  mediaTypes?: MediaType;
  allowsEditing?: boolean;
  allowsMultipleSelection?: boolean;
  aspect?: [number, number];
  quality?: MediaQuality;
  selectionLimit?: number;
}

/**
 * Media asset interface
 */
export interface MediaAsset {
  uri: string;
  width: number;
  height: number;
  type: MediaType;
  fileSize?: number;
  fileName?: string;
  duration?: number;
  base64?: string;
}

/**
 * Media picker result
 */
export interface MediaPickerResult {
  canceled: boolean;
  assets?: MediaAsset[];
}

/**
 * Camera options
 */
export interface CameraOptions {
  quality?: MediaQuality;
  allowsEditing?: boolean;
  aspect?: [number, number];
  base64?: boolean;
  videoMaxDuration?: number; // Maximum video duration in seconds
}

/**
 * Media library permissions
 */
export enum MediaLibraryPermission {
  GRANTED = 'granted',
  DENIED = 'denied',
  LIMITED = 'limited',
}

/**
 * Media constants
 */
export const MEDIA_CONSTANTS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100 MB
  DEFAULT_QUALITY: MediaQuality.HIGH,
  DEFAULT_FORMAT: ImageFormat.JPEG,
  DEFAULT_ASPECT_RATIO: [4, 3] as [number, number],
  DEFAULT_SELECTION_LIMIT: 10,
  SUPPORTED_IMAGE_FORMATS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  SUPPORTED_VIDEO_FORMATS: ['.mp4', '.mov'],
} as const;

/**
 * MIME type mappings for images
 */
export const IMAGE_MIME_TYPES = {
  [ImageFormat.PNG]: 'image/png',
  [ImageFormat.JPEG]: 'image/jpeg',
  [ImageFormat.WEBP]: 'image/webp',
} as const;

/**
 * Media utilities
 */
export class MediaUtils {
  /**
   * Check if URI is an image
   */
  static isImage(uri: string): boolean {
    const extension = uri.split('.').pop()?.toLowerCase();
    return MEDIA_CONSTANTS.SUPPORTED_IMAGE_FORMATS.some(
      format => format.replace('.', '') === extension
    );
  }

  /**
   * Check if URI is a video
   */
  static isVideo(uri: string): boolean {
    const extension = uri.split('.').pop()?.toLowerCase();
    return MEDIA_CONSTANTS.SUPPORTED_VIDEO_FORMATS.some(
      format => format.replace('.', '') === extension
    );
  }

  /**
   * Get MIME type for image format
   */
  static getImageMimeType(format: ImageFormat): string {
    return IMAGE_MIME_TYPES[format];
  }

  /**
   * Calculate aspect ratio from dimensions
   */
  static calculateAspectRatio(width: number, height: number): number {
    return width / height;
  }

  /**
   * Get scaled dimensions maintaining aspect ratio
   */
  static getScaledDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): ImageDimensions {
    const aspectRatio = MediaUtils.calculateAspectRatio(originalWidth, originalHeight);

    let width = originalWidth;
    let height = originalHeight;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  /**
   * Validate image dimensions
   */
  static isValidDimensions(width: number, height: number): boolean {
    return width > 0 && height > 0 && width <= 8192 && height <= 8192;
  }

  /**
   * Get quality value (0-1) from enum
   */
  static getQualityValue(quality: MediaQuality): number {
    return quality;
  }

  /**
   * Parse media type from MIME type
   */
  static parseMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    return MediaType.ALL;
  }
}

