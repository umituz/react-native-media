/**
 * Card Multimedia Flashcard Hooks
 * React hooks for multimedia flashcard functionality
 */

import React from "react";
import type {
  CardMediaAttachment,
  CardMediaGenerationRequest,
  CardMediaGenerationResult,
  CardMediaCompressionOptions,
  CardMediaValidation,
  CardMediaUploadProgress,
  CardMultimediaFlashcard,
  CardMultimediaFlashcardService,
} from "../../domain/entities/CardMultimedia.types";

export interface UseCardMediaUploadResult {
  uploadMedia: (
    file: any,
    options?: CardMediaCompressionOptions,
  ) => Promise<CardMediaAttachment>;
  isUploading: boolean;
  uploadProgress: CardMediaUploadProgress | null;
  error: string | null;
}

export interface UseCardMediaGenerationResult {
  generateMedia: (
    request: CardMediaGenerationRequest,
  ) => Promise<CardMediaGenerationResult>;
  isGenerating: boolean;
  generationResult: CardMediaGenerationResult | null;
  error: string | null;
}

export interface UseCardMediaValidationResult {
  validateMedia: (file: any) => Promise<CardMediaValidation>;
  isValidating: boolean;
  validation: CardMediaValidation | null;
  error: string | null;
}

export interface UseCardMultimediaFlashcardResult {
  createCardMultimedia: (cardData: any) => Promise<CardMultimediaFlashcard>;
  updateCardMedia: (
    cardId: string,
    media: CardMediaAttachment[],
  ) => Promise<CardMultimediaFlashcard>;
  deleteCardMedia: (attachmentId: string) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

// Mock React Query implementation
const useMockQuery = (queryKey: any[], queryFn: any) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    queryFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [queryKey]);

  return { data, loading, error, refetch: () => {} };
};

export const useCardMediaUpload = (): UseCardMediaUploadResult => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] =
    React.useState<CardMediaUploadProgress | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const uploadMedia = React.useCallback(
    async (file: any, options?: CardMediaCompressionOptions) => {
      try {
        setIsUploading(true);
        setError(null);

        // Simulate upload progress
        setUploadProgress({
          fileId: `upload_${Date.now()}`,
          progress: 0,
          status: "uploading",
        });

        // Simulate progress updates
        for (let i = 1; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setUploadProgress((prev) => (prev ? { ...prev, progress: i } : null));
        }

        const attachment: CardMediaAttachment = {
          id: `card_media_${Date.now()}`,
          type: getMediaType(file.type),
          position: "both",
          url: `https://storage.example.com/media/${Date.now()}_${file.name}`,
          filename: file.name,
          fileSize: file.size || 100000,
          mimeType: file.type,
          duration: await getMediaDuration(file),
          thumbnailUrl: generateThumbnail(file),
          caption: "",
          isDownloaded: true,
          createdAt: new Date().toISOString(),
        };

        setUploadProgress({
          fileId: `upload_${Date.now()}`,
          progress: 100,
          status: "completed",
          url: attachment.url,
        });

        return attachment;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        setIsUploading(false);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    uploadMedia,
    isUploading,
    uploadProgress,
    error,
  };
};

export const useCardMediaGeneration = (): UseCardMediaGenerationResult => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationResult, setGenerationResult] =
    React.useState<CardMediaGenerationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const generateMedia = React.useCallback(
    async (
      request: CardMediaGenerationRequest,
    ): Promise<CardMediaGenerationResult> => {
      try {
        setIsGenerating(true);
        setError(null);

        // Simulate generation
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const attachments: CardMediaAttachment[] = [];

        switch (request.type) {
          case "text_to_image":
            for (let i = 0; i < (request.options.maxResults || 1); i++) {
              attachments.push({
                id: `ai_img_${Date.now()}_${i}`,
                type: "image",
                position: "both",
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
              type: "audio",
              position: "back",
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
                type: "image",
                position: "both",
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

        const result: CardMediaGenerationResult = {
          success: true,
          attachments,
          creditsUsed:
            request.type === "text_to_image"
              ? 5
              : request.type === "text_to_audio"
                ? 3
                : 2,
          processingTime: 3000,
          requestId: `req_${Date.now()}`,
        };

        setGenerationResult(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Generation failed";
        setError(errorMessage);
        setIsGenerating(false);

        return {
          success: false,
          attachments: [],
          creditsUsed: 0,
          processingTime: 0,
          error: errorMessage,
          requestId: "",
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  return {
    generateMedia,
    isGenerating,
    generationResult,
    error,
  };
};

export const useCardMediaValidation = (): UseCardMediaValidationResult => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [validation, setValidation] =
    React.useState<CardMediaValidation | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const validateMedia = React.useCallback(
    async (file: any): Promise<CardMediaValidation> => {
      try {
        setIsValidating(true);
        setError(null);

        // Simulate validation
        await new Promise((resolve) => setTimeout(resolve, 500));

        const errors: string[] = [];
        const warnings: string[] = [];
        const recommendations: string[] = [];

        // File size validation
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
          errors.push(
            `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`,
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

        const result: CardMediaValidation = {
          isValid: errors.length === 0,
          errors,
          warnings,
          recommendations,
        };

        setValidation(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Validation failed";
        setError(errorMessage);
        setIsValidating(false);

        return {
          isValid: false,
          errors: [errorMessage],
          warnings: [],
          recommendations: [],
        };
      } finally {
        setIsValidating(false);
      }
    },
    [],
  );

  return {
    validateMedia,
    isValidating,
    validation,
    error,
  };
};

export const useCardMultimediaFlashcard =
  (): UseCardMultimediaFlashcardResult => {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const createCardMultimedia = React.useCallback(
      async (cardData: any): Promise<CardMultimediaFlashcard> => {
        try {
          setIsProcessing(true);
          setError(null);

          // Simulate card creation
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const card: CardMultimediaFlashcard = {
            id: `card_multimedia_${Date.now()}`,
            front: cardData.front || "",
            back: cardData.back || "",
            difficulty: cardData.difficulty || "medium",
            tags: cardData.tags || [],
            media: cardData.media || [],
            hasMedia: (cardData.media || []).length > 0,
            mediaType: extractMediaTypes(cardData.media || []),
            isDownloaded: (cardData.media || []).every(
              (m: any) => m.isDownloaded,
            ),
            estimatedSize: calculateTotalSize(cardData.media || []),
            createdAt: new Date().toISOString(),
          };

          return card;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Card creation failed";
          setError(errorMessage);
          setIsProcessing(false);
          throw err;
        } finally {
          setIsProcessing(false);
        }
      },
      [],
    );

    const updateCardMedia = React.useCallback(
      async (
        cardId: string,
        media: CardMediaAttachment[],
      ): Promise<CardMultimediaFlashcard> => {
        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {} as CardMultimediaFlashcard;
      },
      [],
    );

    const deleteCardMedia = React.useCallback(
      async (attachmentId: string): Promise<void> => {
        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 500));
      },
      [],
    );

    return {
      createCardMultimedia,
      updateCardMedia,
      deleteCardMedia,
      isProcessing,
      error,
    };
  };

// Helper functions
const getMediaType = (mimeType: string): "image" | "audio" | "video" => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return "image"; // Default fallback
};

const getMediaDuration = async (file: any): Promise<number | undefined> => {
  if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
    return Math.floor(Math.random() * 60) + 10;
  }
  return undefined;
};

const generateThumbnail = (file: any): string | undefined => {
  if (file.type.startsWith("video/")) {
    return `https://picsum.photos/200/150?random=${Date.now()}`;
  }
  return undefined;
};

const extractMediaTypes = (
  media: CardMediaAttachment[],
): ("image" | "audio" | "video")[] => {
  const types: Set<string> = new Set();
  media.forEach((m) => types.add(m.type));
  return Array.from(types) as ("image" | "audio" | "video")[];
};

const calculateTotalSize = (media: CardMediaAttachment[]): number => {
  return media.reduce((total, m) => total + m.fileSize, 0);
};

const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};
