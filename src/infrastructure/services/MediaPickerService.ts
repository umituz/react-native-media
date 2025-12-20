/**
 * Media Domain - Media Picker Service
 *
 * Service for picking images/videos using expo-image-picker.
 * Handles camera, gallery, and media library permissions.
 */

import * as ImagePicker from "expo-image-picker";
import type {
  MediaPickerOptions,
  MediaPickerResult,
  CameraOptions,
  MediaAsset,
} from "../../domain/entities/Media";
import {
  MediaLibraryPermission,
  MediaType,
  MEDIA_CONSTANTS,
} from "../../domain/entities/Media";

/**
 * Media picker service for selecting images/videos
 */
export class MediaPickerService {
  static async requestCameraPermission(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch {
      return MediaLibraryPermission.DENIED;
    }
  }

  static async requestMediaLibraryPermission(): Promise<MediaLibraryPermission> {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch {
      return MediaLibraryPermission.DENIED;
    }
  }

  static async getCameraPermissionStatus(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch {
      return MediaLibraryPermission.DENIED;
    }
  }

  static async getMediaLibraryPermissionStatus(): Promise<MediaLibraryPermission> {
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      return MediaPickerService.mapPermissionStatus(status);
    } catch {
      return MediaLibraryPermission.DENIED;
    }
  }

  static async launchCamera(
    options?: CameraOptions
  ): Promise<MediaPickerResult> {
    try {
      const permission = await MediaPickerService.requestCameraPermission();
      if (permission === MediaLibraryPermission.DENIED) {
        return { canceled: true };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: options?.allowsEditing ?? false,
        aspect: options?.aspect,
        quality: options?.quality ?? MEDIA_CONSTANTS.DEFAULT_QUALITY,
        base64: options?.base64 ?? false,
      });

      return MediaPickerService.mapPickerResult(result);
    } catch {
      return { canceled: true };
    }
  }

  static async launchCameraForVideo(
    options?: CameraOptions
  ): Promise<MediaPickerResult> {
    try {
      const permission = await MediaPickerService.requestCameraPermission();
      if (permission === MediaLibraryPermission.DENIED) {
        return { canceled: true };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["videos"],
        allowsEditing: options?.allowsEditing ?? false,
        quality: options?.quality ?? MEDIA_CONSTANTS.DEFAULT_QUALITY,
        videoMaxDuration: options?.videoMaxDuration,
      });

      return MediaPickerService.mapPickerResult(result);
    } catch {
      return { canceled: true };
    }
  }

  static async pickImage(
    options?: MediaPickerOptions
  ): Promise<MediaPickerResult> {
    try {
      const permission =
        await MediaPickerService.requestMediaLibraryPermission();
      if (permission === MediaLibraryPermission.DENIED) {
        return { canceled: true };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: MediaPickerService.mapMediaType(options?.mediaTypes),
        allowsEditing: options?.allowsEditing ?? false,
        allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
        aspect: options?.aspect,
        quality: options?.quality ?? MEDIA_CONSTANTS.DEFAULT_QUALITY,
        selectionLimit:
          options?.selectionLimit ?? MEDIA_CONSTANTS.DEFAULT_SELECTION_LIMIT,
        base64: options?.base64 ?? false,
      });

      return MediaPickerService.mapPickerResult(result);
    } catch {
      return { canceled: true };
    }
  }

  static async pickSingleImage(
    options?: Omit<MediaPickerOptions, "allowsMultipleSelection">
  ): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      allowsMultipleSelection: false,
    });
  }

  static async pickMultipleImages(
    options?: Omit<MediaPickerOptions, "allowsMultipleSelection">
  ): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      allowsMultipleSelection: true,
    });
  }

  static async pickVideo(
    options?: Omit<MediaPickerOptions, "mediaTypes">
  ): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      mediaTypes: MediaType.VIDEO,
    });
  }

  static async pickMedia(
    options?: MediaPickerOptions
  ): Promise<MediaPickerResult> {
    return MediaPickerService.pickImage({
      ...options,
      mediaTypes: MediaType.ALL,
    });
  }

  private static mapPermissionStatus(
    status: ImagePicker.PermissionStatus
  ): MediaLibraryPermission {
    switch (status) {
      case ImagePicker.PermissionStatus.GRANTED:
        return MediaLibraryPermission.GRANTED;
      case ImagePicker.PermissionStatus.DENIED:
        return MediaLibraryPermission.DENIED;
      case ImagePicker.PermissionStatus.UNDETERMINED:
        return MediaLibraryPermission.DENIED;
      default:
        return MediaLibraryPermission.DENIED;
    }
  }

  private static mapMediaType(
    type?: MediaType
  ): ImagePicker.MediaType[] {
    switch (type) {
      case MediaType.IMAGE:
        return ["images"];
      case MediaType.VIDEO:
        return ["videos"];
      case MediaType.ALL:
        return ["images", "videos"];
      default:
        return ["images"];
    }
  }

  private static mapPickerResult(
    result: ImagePicker.ImagePickerResult
  ): MediaPickerResult {
    if (result.canceled) {
      return { canceled: true };
    }

    const assets: MediaAsset[] = result.assets.map((asset) => ({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type === "video" ? MediaType.VIDEO : MediaType.IMAGE,
      fileSize: asset.fileSize,
      fileName: asset.fileName ?? undefined,
      duration: asset.duration ?? undefined,
      base64: asset.base64 ?? undefined,
      mimeType: asset.mimeType ?? undefined,
    }));

    return {
      canceled: false,
      assets,
    };
  }
}
