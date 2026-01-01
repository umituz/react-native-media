/**
 * Multimedia Flashcard Service
 * Media attachments for flashcards
 */

import type {
  MediaAttachment,
  MediaGenerationRequest,
  MediaGenerationResult,
  MediaCompressionOptions,
  MediaValidation,
  MediaUploadProgress,
  MediaType,
  MediaPosition,
} from "../domain/entities/MultimediaFlashcard.types";

export class MultimediaFlashcardService {
  private static instance: MultimediaFlashcardService;

  static getInstance(): MultimediaFlashcardService {
    if (!MultimediaFlashcardService.instance) {
      MultimediaFlashcardService.instance = new MultimediaFlashcardService();
    }
    return MultimediaFlashcardService.instance;
  }

  /**
   * Upload media file with optional compression
   */
  async uploadMedia(
    file: any,
    options?: MediaCompressionOptions,
  ): Promise<MediaAttachment> {
    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const attachment: MediaAttachment = {
        id: `media_${Date.now()}`,
        type: this.getMediaType(file.type),
        position: "both" as MediaPosition,
        url: `https://storage.example.com/media/${Date.now()}_${file.name}`,
        filename: file.name,
        fileSize: file.size || 100000,
        mimeType: file.type,
        duration: this.getMediaDuration(file),
        thumbnailUrl: this.generateThumbnail(file),
        caption: "",
        isDownloaded: true,
        createdAt: new Date().toISOString(),
      };

      return attachment;
    } catch (error) {
      throw new Error(`Failed to upload media: ${error}`);
    }
  }

  /**
   * Generate media from AI (text-to-image, text-to-audio, etc.)
   */
  async generateMedia(
    request: MediaGenerationRequest,
  ): Promise<MediaGenerationResult> {
    try {
      const startTime = Date.now();

      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const attachments: MediaAttachment[] = [];

      switch (request.type) {
        case "text_to_image":
          for (let i = 0; i < (request.options.maxResults || 1); i++) {
            attachments.push({
              id: `ai_img_${Date.now()}_${i}`,
              type: "image" as MediaType,
              position: "both" as MediaPosition,
              url: `https://picsum.photos/400/300?random=${Date.now() + i}`,
              filename: `ai_generated_${i}.jpg`,
              fileSize: 150000, // 150KB
              mimeType: "image/jpeg",
              isDownloaded: false,
              createdAt: new Date().toISOString(),
            });
          }
          break;

        case "text_to_audio":
          attachments.push({
            id: `ai_audio_${Date.now()}`,
            type: "audio" as MediaType,
            position: "back" as MediaPosition,
            url: `https://example.com/audio_${Date.now()}.mp3`,
            filename: `ai_generated_${Date.now()}.mp3`,
            fileSize: 80000, // 80KB
            mimeType: "audio/mp3",
            duration: 10, // 10 seconds
            isDownloaded: false,
            createdAt: new Date().toISOString(),
          });
          break;

        case "image_search":
          for (let i = 0; i < (request.options.maxResults || 5); i++) {
            attachments.push({
              id: `search_img_${Date.now()}_${i}`,
              type: "image" as MediaType,
              position: "both" as MediaPosition,
              url: `https://picsum.photos/400/300?random=${Date.now() + i}`,
              filename: `search_result_${i}.jpg`,
              fileSize: 120000, // 120KB
              mimeType: "image/jpeg",
              isDownloaded: false,
              createdAt: new Date().toISOString(),
            });
          }
          break;
      }

      return {
        success: true,
        attachments,
        creditsUsed:
          request.type === "text_to_image"
            ? 5
            : request.type === "text_to_audio"
              ? 3
              : 2,
        processingTime: Date.now() - startTime,
        requestId: `req_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        attachments: [],
        creditsUsed: 0,
        processingTime: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        requestId: "",
      };
    }
  }

  /**
   * Validate media file before upload
   */
  async validateMedia(file: any): Promise<MediaValidation> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];
      const recommendations: string[] = [];

      // File size validation
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        errors.push(
          `File size (${this.formatFileSize(file.size)}) exceeds maximum allowed size (${this.formatFileSize(maxSize)})`,
        );
      } else if (file.size > 10 * 1024 * 1024) {
        // 10MB
        warnings.push(`Large file size may impact performance`);
        recommendations.push("Consider compressing file");
      }

      // File type validation
      const supportedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "audio/mp3",
        "audio/wav",
        "audio/m4a",
        "video/mp4",
        "video/mov",
      ];

      if (!supportedTypes.includes(file.type)) {
        errors.push(`Unsupported file type: ${file.type}`);
      }

      // Media-specific validations
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB for images
          warnings.push("Very large image may cause performance issues");
          recommendations.push("Consider resizing image to under 5MB");
        }
      }

      if (file.type.startsWith("audio/")) {
        // Simulate audio duration check
        const duration = await this.getMediaDuration(file);
        if (duration && duration > 300) {
          // 5 minutes
          warnings.push("Long audio files may impact app performance");
          recommendations.push("Consider trimming audio to under 5 minutes");
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        recommendations,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : "Validation failed"],
        warnings: [],
        recommendations: [],
      };
    }
  }

  private getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("video/")) return "video";
    return "image"; // Default fallback
  }

  private async getMediaDuration(file: any): Promise<number | undefined> {
    // Mock duration calculation
    if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
      return Math.floor(Math.random() * 60) + 10; // 10-70 seconds
    }
    return undefined;
  }

  private generateThumbnail(file: any): string | undefined {
    if (file.type.startsWith("video/")) {
      return `https://picsum.photos/200/150?random=${Date.now()}`;
    }
    return undefined;
  }

  private formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }
}
