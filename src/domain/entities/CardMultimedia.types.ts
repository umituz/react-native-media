/**
 * Card Multimedia Types
 * Multimedia support for flashcard functionality
 */

export type CardMediaType = "image" | "audio" | "video";
export type CardMediaPosition = "front" | "back" | "both";

export interface CardMediaAttachment {
  id: string;
  type: CardMediaType;
  position: CardMediaPosition;
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

export interface CardMultimediaFlashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  // Extended properties for multimedia support
  media: CardMediaAttachment[];
  hasMedia: boolean; // Computed property
  mediaType: CardMediaType[]; // Array of media types present
  isDownloaded: boolean; // All media downloaded?
  estimatedSize: number; // Total size in bytes
}

export interface CardMediaGenerationRequest {
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

export interface CardMediaGenerationResult {
  success: boolean;
  attachments: CardMediaAttachment[];
  creditsUsed: number;
  processingTime: number;
  error?: string;
  requestId: string;
}

export interface CardMediaUploadProgress {
  fileId: string;
  progress: number; // 0-100
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
  url?: string;
}

export interface CardMediaCompressionOptions {
  quality: number; // 0.1 - 1.0
  maxWidth?: number;
  maxHeight?: number;
  maxFileSize?: number; // bytes
  format?: "jpeg" | "png" | "webp";
}

export interface CardMediaValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface CardMultimediaFlashcardService {
  uploadMedia(
    file: any,
    options?: CardMediaCompressionOptions,
  ): Promise<CardMediaAttachment>;
  generateMedia(
    request: CardMediaGenerationRequest,
  ): Promise<CardMediaGenerationResult>;
  validateMedia(file: any): Promise<CardMediaValidation>;
  optimizeMedia(
    attachment: CardMediaAttachment,
    options: CardMediaCompressionOptions,
  ): Promise<CardMediaAttachment>;
  deleteMedia(attachmentId: string): Promise<void>;
  getMediaUrl(attachmentId: string): Promise<string>;
  downloadMedia(attachmentId: string): Promise<string>; // Returns local path
}
