# @umituz/react-native-media

Media picking capabilities for React Native apps - Images, videos from camera and gallery.

## Features

- ✅ **Image Picking** - Pick single or multiple images from gallery
- ✅ **Video Picking** - Pick videos from gallery
- ✅ **Camera Capture** - Take photos and record videos with camera
- ✅ **Permission Management** - Built-in camera and media library permissions
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **File System Integration** - Uses @umituz/react-native-filesystem for file operations

## Installation

```bash
npm install @umituz/react-native-media
```

## Peer Dependencies

```bash
npm install expo-image-picker @umituz/react-native-filesystem
```

## Usage

### Basic Image Picking

```tsx
import { useMedia } from '@umituz/react-native-media';

function MyComponent() {
  const { pickImage, isLoading } = useMedia();

  const handlePick = async () => {
    const result = await pickImage({ allowsEditing: true });
    if (!result.canceled && result.assets) {
      console.log('Image URI:', result.assets[0].uri);
    }
  };

  return (
    <Button onPress={handlePick} disabled={isLoading}>
      Pick Image
    </Button>
  );
}
```

### Multiple Images

```tsx
const { pickMultipleImages } = useMedia();

const handleMultiple = async () => {
  const result = await pickMultipleImages({ selectionLimit: 5 });
  if (!result.canceled && result.assets) {
    console.log('Selected:', result.assets.length, 'images');
  }
};
```

### Camera Capture

```tsx
const { launchCamera, launchCameraForVideo } = useMedia();

// Take photo
const handleCamera = async () => {
  const result = await launchCamera({
    quality: 0.8,
    allowsEditing: true,
  });
};

// Record video
const handleVideo = async () => {
  const result = await launchCameraForVideo({
    quality: 0.8,
    videoMaxDuration: 60,
  });
};
```

### Permissions

```tsx
const {
  requestCameraPermission,
  requestMediaLibraryPermission,
  getCameraPermissionStatus,
} = useMedia();

const checkPermissions = async () => {
  const status = await getCameraPermissionStatus();
  if (status === 'denied') {
    await requestCameraPermission();
  }
};
```

## API Reference

### `useMedia()`

React hook for media picking operations.

**Returns:**
- `pickImage(options?)` - Pick single image
- `pickMultipleImages(options?)` - Pick multiple images
- `pickVideo(options?)` - Pick video
- `launchCamera(options?)` - Take photo with camera
- `launchCameraForVideo(options?)` - Record video with camera
- `requestCameraPermission()` - Request camera permission
- `requestMediaLibraryPermission()` - Request media library permission
- `getCameraPermissionStatus()` - Get camera permission status
- `getMediaLibraryPermissionStatus()` - Get media library permission status
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message

### `MediaPickerService`

Static service class for media picking operations.

**Methods:**
- `pickImage(options?)` - Pick image from library
- `pickSingleImage(options?)` - Pick single image
- `pickMultipleImages(options?)` - Pick multiple images
- `pickVideo(options?)` - Pick video
- `pickMedia(options?)` - Pick any media
- `launchCamera(options?)` - Launch camera for photo
- `launchCameraForVideo(options?)` - Launch camera for video
- `requestCameraPermission()` - Request camera permission
- `requestMediaLibraryPermission()` - Request media library permission
- `getCameraPermissionStatus()` - Get camera permission status
- `getMediaLibraryPermissionStatus()` - Get media library permission status
- `savePickedImage(uri, filename?)` - Save image to documents
- `savePickedImages(uris)` - Save multiple images to documents

## Types

- `MediaType` - Image, Video, All
- `MediaQuality` - Low (0.3), Medium (0.7), High (1.0)
- `MediaLibraryPermission` - Granted, Denied, Limited
- `MediaPickerOptions` - Picker configuration
- `CameraOptions` - Camera configuration
- `MediaPickerResult` - Picker result
- `MediaAsset` - Media asset information

## License

MIT

## Author

Ümit UZ <umit@umituz.com>

