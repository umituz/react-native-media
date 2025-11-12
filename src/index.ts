/**
 * @umituz/react-native-media - Public API
 *
 * Media picking capabilities for React Native apps
 * Provides images, videos from camera and gallery
 *
 * Usage:
 *   import { useMedia, MediaPickerService, MediaType, MediaQuality } from '@umituz/react-native-media';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  MediaAsset,
  MediaPickerResult,
  MediaPickerOptions,
  CameraOptions,
  ImageDimensions,
  ImageManipulationActions,
  ImageSaveOptions,
} from './domain/entities/Media';

export {
  MediaType,
  ImageFormat,
  MediaQuality,
  MediaLibraryPermission,
  MEDIA_CONSTANTS,
  IMAGE_MIME_TYPES,
  MediaUtils,
} from './domain/entities/Media';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { MediaPickerService } from './infrastructure/services/MediaPickerService';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export { useMedia } from './presentation/hooks/useMedia';

