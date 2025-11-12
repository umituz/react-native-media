/**
 * Media Domain - useMedia Hook
 *
 * React hook for media picking operations (images, videos).
 * For image MANIPULATION, use @domains/image instead.
 *
 * NOTE: This hook focuses on PICKING media (camera, gallery).
 * Image manipulation features moved to @domains/image for better separation.
 */

import { useState, useCallback } from 'react';
import { MediaPickerService } from '../../infrastructure/services/MediaPickerService';
import type {
  MediaPickerOptions,
  MediaPickerResult,
  CameraOptions,
  MediaLibraryPermission,
} from '../../domain/entities/Media';

/**
 * useMedia hook for complete media workflow
 *
 * USAGE:
 * ```typescript
 * const {
 *   pickImage,
 *   pickMultipleImages,
 *   launchCamera,
 *   isLoading,
 *   error,
 * } = useMedia();
 *
 * const handlePickImage = async () => {
 *   const result = await pickImage({ allowsEditing: true });
 *   if (!result.canceled && result.assets) {
 *     console.log('Picked:', result.assets[0].uri);
 *   }
 * };
 * ```
 */
export const useMedia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Pick single image from library
   */
  const pickImage = useCallback(async (options?: MediaPickerOptions): Promise<MediaPickerResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await MediaPickerService.pickSingleImage(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick image';
      setError(errorMessage);
      return { canceled: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Pick multiple images from library
   */
  const pickMultipleImages = useCallback(async (options?: MediaPickerOptions): Promise<MediaPickerResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await MediaPickerService.pickMultipleImages(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick images';
      setError(errorMessage);
      return { canceled: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Pick video from library
   */
  const pickVideo = useCallback(async (options?: MediaPickerOptions): Promise<MediaPickerResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await MediaPickerService.pickVideo(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick video';
      setError(errorMessage);
      return { canceled: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Launch camera to take photo
   */
  const launchCamera = useCallback(async (options?: CameraOptions): Promise<MediaPickerResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await MediaPickerService.launchCamera(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to launch camera';
      setError(errorMessage);
      return { canceled: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Launch camera to record video
   */
  const launchCameraForVideo = useCallback(async (options?: CameraOptions): Promise<MediaPickerResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await MediaPickerService.launchCameraForVideo(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record video';
      setError(errorMessage);
      return { canceled: true };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Request camera permission
   */
  const requestCameraPermission = useCallback(async (): Promise<MediaLibraryPermission> => {
    try {
      return await MediaPickerService.requestCameraPermission();
    } catch (err) {
      return 'denied';
    }
  }, []);

  /**
   * Request media library permission
   */
  const requestMediaLibraryPermission = useCallback(async (): Promise<MediaLibraryPermission> => {
    try {
      return await MediaPickerService.requestMediaLibraryPermission();
    } catch (err) {
      return 'denied';
    }
  }, []);

  /**
   * Check camera permission status
   */
  const getCameraPermissionStatus = useCallback(async (): Promise<MediaLibraryPermission> => {
    try {
      return await MediaPickerService.getCameraPermissionStatus();
    } catch (err) {
      return 'denied';
    }
  }, []);

  /**
   * Check media library permission status
   */
  const getMediaLibraryPermissionStatus = useCallback(async (): Promise<MediaLibraryPermission> => {
    try {
      return await MediaPickerService.getMediaLibraryPermissionStatus();
    } catch (err) {
      return 'denied';
    }
  }, []);

  return {
    // Picker functions
    pickImage,
    pickMultipleImages,
    pickVideo,
    launchCamera,
    launchCameraForVideo,

    // Permission functions
    requestCameraPermission,
    requestMediaLibraryPermission,
    getCameraPermissionStatus,
    getMediaLibraryPermissionStatus,

    // State
    isLoading,
    error,
  };
};

