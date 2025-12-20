/**
 * Media Domain - useMedia Hook
 *
 * React hook for media picking operations (images, videos).
 * Provides camera, gallery picking functionality.
 */

import { useState, useCallback } from "react";
import { MediaPickerService } from "../../infrastructure/services/MediaPickerService";
import type {
  MediaPickerOptions,
  MediaPickerResult,
  CameraOptions,
} from "../../domain/entities/Media";
import { MediaLibraryPermission } from "../../domain/entities/Media";

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

  const pickImage = useCallback(
    async (options?: MediaPickerOptions): Promise<MediaPickerResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await MediaPickerService.pickSingleImage(options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to pick image";
        setError(errorMessage);
        return { canceled: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const pickMultipleImages = useCallback(
    async (options?: MediaPickerOptions): Promise<MediaPickerResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await MediaPickerService.pickMultipleImages(options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to pick images";
        setError(errorMessage);
        return { canceled: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const pickVideo = useCallback(
    async (options?: MediaPickerOptions): Promise<MediaPickerResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await MediaPickerService.pickVideo(options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to pick video";
        setError(errorMessage);
        return { canceled: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const launchCamera = useCallback(
    async (options?: CameraOptions): Promise<MediaPickerResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await MediaPickerService.launchCamera(options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to launch camera";
        setError(errorMessage);
        return { canceled: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const launchCameraForVideo = useCallback(
    async (options?: CameraOptions): Promise<MediaPickerResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await MediaPickerService.launchCameraForVideo(options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to record video";
        setError(errorMessage);
        return { canceled: true };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const requestCameraPermission =
    useCallback(async (): Promise<MediaLibraryPermission> => {
      try {
        return await MediaPickerService.requestCameraPermission();
      } catch {
        return MediaLibraryPermission.DENIED;
      }
    }, []);

  const requestMediaLibraryPermission =
    useCallback(async (): Promise<MediaLibraryPermission> => {
      try {
        return await MediaPickerService.requestMediaLibraryPermission();
      } catch {
        return MediaLibraryPermission.DENIED;
      }
    }, []);

  const getCameraPermissionStatus =
    useCallback(async (): Promise<MediaLibraryPermission> => {
      try {
        return await MediaPickerService.getCameraPermissionStatus();
      } catch {
        return MediaLibraryPermission.DENIED;
      }
    }, []);

  const getMediaLibraryPermissionStatus =
    useCallback(async (): Promise<MediaLibraryPermission> => {
      try {
        return await MediaPickerService.getMediaLibraryPermissionStatus();
      } catch {
        return MediaLibraryPermission.DENIED;
      }
    }, []);

  return {
    pickImage,
    pickMultipleImages,
    pickVideo,
    launchCamera,
    launchCameraForVideo,
    requestCameraPermission,
    requestMediaLibraryPermission,
    getCameraPermissionStatus,
    getMediaLibraryPermissionStatus,
    isLoading,
    error,
  };
};
