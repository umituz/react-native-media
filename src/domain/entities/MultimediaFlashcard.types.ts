/**
 * Multimedia Flashcard Types
 * Extended media types for flashcard support
 */

export type MediaType = "image" | "audio" | "video";
export type MediaPosition = "front" | "back" | "both";

export interface MediaAttachment {
  id: string;
  type: MediaType;
  position: MediaPosition;
  url: string;
  localPath?: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  duration?: number; // For audio/video in seconds
  thumbnailUrl?: string; // For videos
  caption?: string;
  isDownloaded: boolean;
  createdAt: string;
}

export interface MultimediaFlashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  // Extended properties for multimedia support
  media: MediaAttachment[];
  hasMedia: boolean; // Computed property
  mediaType: MediaType[]; // Array of media types present
  isDownloaded: boolean; // All media downloaded?
  estimatedSize: number; // Total size in bytes
}

export interface MediaGenerationRequest {
  type: "text_to_image" | "text_to_audio" | "image_search";
  input: {
    text?: string;
    prompt?: string;
    language?: string;
    voice?: "male" | "female" | "neutral";
    style?: "realistic" | "cartoon" | "artistic";
  };
  options: {
    maxResults?: number;
    quality?: "low" | "medium" | "high";
    format?: "jpeg" | "png" | "mp3" | "wav";
  };
}

export interface MediaGenerationResult {
  success: boolean;
  attachments: MediaAttachment[];
  creditsUsed: number;
  processingTime: number;
  error?: string;
  requestId: string;
}

export interface MediaUploadProgress {
  fileId: string;
  progress: number; // 0-100
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
  url?: string;
}

export interface MediaCompressionOptions {
  quality: number; // 0.1 - 1.0
  maxWidth?: number;
  maxHeight?: number;
  maxFileSize?: number; // bytes
  format?: "jpeg" | "png" | "webp";
}

export interface MediaValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface MultimediaFlashcardService {
  uploadMedia(
    file: any,
    options?: MediaCompressionOptions,
  ): Promise<MediaAttachment>;
  generateMedia(
    request: MediaGenerationRequest,
  ): Promise<MediaGenerationResult>;
  validateMedia(file: any): Promise<MediaValidation>;
  optimizeMedia(
    attachment: MediaAttachment,
    options: MediaCompressionOptions,
  ): Promise<MediaAttachment>;
  deleteMedia(attachmentId: string): Promise<void>;
  getMediaUrl(attachmentId: string): Promise<string>;
  downloadMedia(attachmentId: string): Promise<string>; // Returns local path
}
