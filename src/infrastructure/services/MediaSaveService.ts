/**
 * Media Save Service
 * Save images and videos to device gallery
 */

import * as MediaLibrary from "expo-media-library";
import { MediaType, MediaLibraryPermission } from "../../domain/entities/Media";

export interface SaveResult {
  success: boolean;
  assetId?: string;
  error?: string;
}

export interface SaveOptions {
  album?: string;
}

/**
 * Service for saving media to gallery
 */
export class MediaSaveService {
  /**
   * Request media library write permission
   */
  static async requestPermission(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return MediaSaveService.mapPermissionStatus(status);
    } catch {
      return MediaLibraryPermission.DENIED;
    }
  }

  /**
   * Get current permission status
   */
  static async getPermissionStatus(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      return MediaSaveService.mapPermissionStatus(status);
    } catch {
      return MediaLibraryPermission.DENIED;
    }
  }

  /**
   * Save image to gallery
   */
  static async saveImage(
    uri: string,
    options?: SaveOptions
  ): Promise<SaveResult> {
    return MediaSaveService.saveToGallery(uri, MediaType.IMAGE, options);
  }

  /**
   * Save video to gallery
   */
  static async saveVideo(
    uri: string,
    options?: SaveOptions
  ): Promise<SaveResult> {
    return MediaSaveService.saveToGallery(uri, MediaType.VIDEO, options);
  }

  /**
   * Save media (image or video) to gallery
   */
  static async saveToGallery(
    uri: string,
    mediaType: MediaType = MediaType.ALL,
    options?: SaveOptions
  ): Promise<SaveResult> {
    try {
      const permission = await MediaSaveService.requestPermission();

      if (permission === MediaLibraryPermission.DENIED) {
        return {
          success: false,
          error: "Permission denied to save media",
        };
      }

      const asset = await MediaLibrary.createAssetAsync(uri);

      if (options?.album) {
        const album = await MediaSaveService.getOrCreateAlbum(options.album);
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }

      return {
        success: true,
        assetId: asset.id,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Failed to save media: ${message}`,
      };
    }
  }

  /**
   * Get or create album
   */
  private static async getOrCreateAlbum(
    albumName: string
  ): Promise<MediaLibrary.Album | null> {
    try {
      const albums = await MediaLibrary.getAlbumsAsync();
      const existingAlbum = albums.find((album) => album.title === albumName);

      if (existingAlbum) {
        return existingAlbum;
      }

      const asset = await MediaLibrary.getAssetsAsync({ first: 1 });
      if (asset.assets.length > 0) {
        const newAlbum = await MediaLibrary.createAlbumAsync(
          albumName,
          asset.assets[0],
          false
        );
        return newAlbum;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Map permission status
   */
  private static mapPermissionStatus(
    status: MediaLibrary.PermissionStatus
  ): MediaLibraryPermission {
    switch (status) {
      case MediaLibrary.PermissionStatus.GRANTED:
        return MediaLibraryPermission.GRANTED;
      case MediaLibrary.PermissionStatus.DENIED:
        return MediaLibraryPermission.DENIED;
      case MediaLibrary.PermissionStatus.UNDETERMINED:
        return MediaLibraryPermission.DENIED;
      default:
        return MediaLibraryPermission.DENIED;
    }
  }
}
