/**
 * Media Domain - Media Picker Service
 *
 * Service for picking images/videos using expo-image-picker.
 * Handles camera, gallery, and media library permissions.
 *
 * NOTE: File operations use @umituz/react-native-filesystem (centralized)
 */

import * as ImagePicker from 'expo-image-picker';
import { FileSystemService } from '@umituz/react-native-filesystem';
import type {
  MediaPickerOptions,
  MediaPickerResult,
  CameraOptions,
  MediaLibraryPermission,
  MediaType,
} from '../../domain/entities/Media';
import { MEDIA_CONSTANTS } from '../../domain/entities/Media';

/**
 * Media picker service for selecting images/videos
 */
export class MediaPickerService {
  /**
   * Request camera permissions
   */
  static async requestCameraPermission(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch (error) {
      return 'denied';
    }
  }

  /**
   * Request media library permissions
   */
  static async requestMediaLibraryPermission(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch (error) {
      return 'denied';
    }
  }

  /**
   * Check camera permission status
   */
  static async getCameraPermissionStatus(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch (error) {
      return 'denied';
    }
  }

  /**
   * Check media library permission status
   */
  static async getMediaLibraryPermissionStatus(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch (error) {
      return 'denied';
    }
  }

  /**
   * Launch camera to take photo
   */
  static async launchCamera(options?: CameraOptions): Promise<MediaPickerResult> {
    try {
      const permission = await MediaPickerService.requestCameraPermission();
      if (permission === 'denied') {
        return { canceled: true };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? false,
        aspect: options?.aspect,
        quality: options?.quality || MEDIA_CONSTANTS.DEFAULT_QUALITY,
        base64: options?.base64 ?? false,
      });

      return MediaPickerService.mapPickerResult(result);
    } catch (error) {
      return { canceled: true };
    }
  }

  /**
   * Launch camera to record video
   */
  static async launchCameraForVideo(options?: CameraOptions): Promise<MediaPickerResult> {
    try {
      const permission = await MediaPickerService.requestCameraPermission();
      if (permission === 'denied') {
        return { canceled: true };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: options?.allowsEditing ?? false,
        quality: options?.quality || MEDIA_CONSTANTS.DEFAULT_QUALITY,
        videoMaxDuration: options?.videoMaxDuration,
      });

      return MediaPickerService.mapPickerResult(result);
    } catch (error) {
      return { canceled: true };
    }
  }

  /**
   * Launch image library picker
   */
  static async pickImage(options?: MediaPickerOptions): Promise<MediaPickerResult> {
    try {
      const permission = await MediaPickerService.requestMediaLibraryPermission();
      if (permission === 'denied') {
        return { canceled: true };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: MediaPickerService.mapMediaType(options?.mediaTypes),
        allowsEditing: options?.allowsEditing ?? false,
        allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
        aspect: options?.aspect,
        quality: options?.quality || MEDIA_CONSTANTS.DEFAULT_QUALITY,
        selectionLimit: options?.selectionLimit || MEDIA_CONSTANTS.DEFAULT_SELECTION_LIMIT,
      });

      return MediaPickerService.mapPickerResult(result);
    } catch (error) {
      return { canceled: true };
    }
  }

  /**
   * Pick single image from library
   */
  static async pickSingleImage(options?: Omit<MediaPickerOptions, 'allowsMultipleSelection'>): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      allowsMultipleSelection: false,
    });
  }

  /**
   * Pick multiple images from library
   */
  static async pickMultipleImages(
    options?: Omit<MediaPickerOptions, 'allowsMultipleSelection'>
  ): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      allowsMultipleSelection: true,
    });
  }

  /**
   * Pick video from library
   */
  static async pickVideo(options?: Omit<MediaPickerOptions, 'mediaTypes'>): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      mediaTypes: 'video',
    });
  }

  /**
   * Pick any media (image or video)
   */
  static async pickMedia(options?: MediaPickerOptions): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      mediaTypes: 'all',
    });
  }

  /**
   * Save picked image to device documents
   */
  static async savePickedImage(uri: string, filename?: string): Promise<string | null> {
    try {
      const result = await FileSystemService.copyToDocuments(uri, filename);
      return result.success ? result.uri : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Save picked images to device documents
   */
  static async savePickedImages(uris: string[]): Promise<string[]> {
    try {
      const results = await Promise.all(
        uris.map(uri => MediaPickerService.savePickedImage(uri))
      );
      return results.filter((uri): uri is string => uri !== null);
    } catch (error) {
      return [];
    }
  }

  /**
   * Map permission status to domain enum
   */
  private static mapPermissionStatus(status: ImagePicker.PermissionStatus): MediaLibraryPermission {
    switch (status) {
      case ImagePicker.PermissionStatus.GRANTED:
        return 'granted';
      case ImagePicker.PermissionStatus.DENIED:
        return 'denied';
      case ImagePicker.PermissionStatus.UNDETERMINED:
        return 'denied';
      default:
        return 'denied';
    }
  }

  /**
   * Map media type to ImagePicker media type
   */
  private static mapMediaType(type?: MediaType): ImagePicker.MediaTypeOptions {
    switch (type) {
      case 'image':
        return ImagePicker.MediaTypeOptions.Images;
      case 'video':
        return ImagePicker.MediaTypeOptions.Videos;
      case 'all':
        return ImagePicker.MediaTypeOptions.All;
      default:
        return ImagePicker.MediaTypeOptions.Images;
    }
  }

  /**
   * Map ImagePicker result to domain result
   */
  private static mapPickerResult(result: ImagePicker.ImagePickerResult): MediaPickerResult {
    if (result.canceled) {
      return { canceled: true };
    }

    return {
      canceled: false,
      assets: result.assets.map(asset => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type === 'video' ? 'video' : 'image',
        fileSize: asset.fileSize,
        fileName: asset.fileName ?? undefined,
        duration: asset.duration,
        base64: asset.base64,
      })),
    };
  }
}

