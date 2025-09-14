/*
 * Extended memory types and schemas.
 *
 * This module extends the base memory types with additional fields
 * required by the audit and provides Zod schemas for request/response
 * validation. These types are consumed by the memory API routes and
 * the MemoryService. Keeping these definitions in one place helps
 * ensure consistency across the system and reduces duplication.
 */

import { z } from 'zod';

// PII flags type (e.g. redacted fields). Extend this enum as needed.
export const PiiFlagEnum = z.enum(['none', 'flag', 'redacted']);
export type PiiFlag = z.infer<typeof PiiFlagEnum>;

// Interface describing an extended memory entry stored in maas.memory_entries
export interface ExtendedMemoryEntry {
  id: string;
  tenant_id: string;
  source: string;
  raw_text: string | null;
  clean_text: string;
  content_hash: string | null;
  embedding_version: string;
  metadata: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
}

// Represents a chunk stored in maas.memory_vectors. It links back to its
// parent entry and contains the embedding and associated metadata.
export interface MemoryChunk {
  id: string;
  entry_id: string;
  chunk_id: number;
  embedding: number[] | null;
  tenant_id: string;
  tags: string[];
  score_fields: Record<string, unknown>;
  created_at: string;
  timestamp: string;
}

// API request and response schemas

export const IngestRequestSchema = z.object({
  text: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']).optional(),
        content: z.string(),
      })
    )
    .optional(),
  file_ref: z.string().optional(),
  source: z.string().optional(),
  tenant_id: z.string(),
  tags: z.array(z.string()).optional(),
  pii_handling: z.enum(['redact', 'flag', 'none']).optional(),
  chunk: z.boolean().optional().default(true),
});
export type IngestRequest = z.infer<typeof IngestRequestSchema>;

export const IngestResponseSchema = z.object({
  entry_ids: z.array(z.string()),
  chunks: z.array(
    z.object({
      chunk_id: z.number(),
      text: z.string(),
      embedding_version: z.string(),
    })
  ),
  embedding_version: z.string(),
});
export type IngestResponse = z.infer<typeof IngestResponseSchema>;

export const ReembedRequestSchema = z.object({
  entry_ids: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional(),
  target_embedding_version: z.string(),
});
export type ReembedRequest = z.infer<typeof ReembedRequestSchema>;

export const ReembedResponseSchema = z.object({
  job_id: z.string(),
  status: z.string(),
});
export type ReembedResponse = z.infer<typeof ReembedResponseSchema>;

export const RetrieveRequestSchema = z.object({
  query: z.string(),
  top_k: z.number().optional(),
  filters: z.record(z.any()).optional(),
  with_summaries: z.boolean().optional(),
});
export type RetrieveRequest = z.infer<typeof RetrieveRequestSchema>;

export const RetrieveContextResultSchema = z.object({
  text: z.string(),
  entry_id: z.string(),
  chunk_id: z.number(),
  score: z.number(),
  source: z.string().optional(),
  uri: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
});
export type RetrieveContextResult = z.infer<typeof RetrieveContextResultSchema>;

export const RetrieveResponseSchema = z.object({
  context: z.array(RetrieveContextResultSchema),
  prompt_tokens_estimate: z.number(),
});
export type RetrieveResponse = z.infer<typeof RetrieveResponseSchema>;

export const ContextRequestSchema = z.object({
  query: z.string(),
  max_tokens: z.number().optional(),
  style: z.enum(['qa', 'rewrite', 'code']).optional(),
  policy: z.enum(['strict', 'generous']).optional(),
  filters: z.record(z.any()).optional(),
});
export type ContextRequest = z.infer<typeof ContextRequestSchema>;

export const ContextResponseCitationsSchema = z.object({
  entry_id: z.string(),
  chunk_id: z.number(),
  uri: z.string().optional().nullable(),
});
export type ContextResponseCitations = z.infer<typeof ContextResponseCitationsSchema>;

export const ContextResponseSchema = z.object({
  prompt_context: z.string(),
  citations: z.array(ContextResponseCitationsSchema),
});
export type ContextResponse = z.infer<typeof ContextResponseSchema>;

export const FeedbackRequestSchema = z.object({
  entry_id: z.string(),
  useful: z.boolean(),
  notes: z.string().optional(),
});
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;

export const FeedbackResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;

export const DeletePurgeRequestSchema = z.object({
  entry_ids: z.array(z.string()).optional(),
  filters: z.record(z.any()).optional(),
  purge: z.boolean().optional(),
});
export type DeletePurgeRequest = z.infer<typeof DeletePurgeRequestSchema>;

export const DeletePurgeResponseSchema = z.object({
  deleted_count: z.number(),
  failed_ids: z.array(z.string()).optional(),
  job_id: z.string().optional(),
});
export type DeletePurgeResponse = z.infer<typeof DeletePurgeResponseSchema>;

// Utility schema to validate the extended memory entry when returning from the API
export const ExtendedMemoryEntrySchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  source: z.string(),
  raw_text: z.string().nullable(),
  clean_text: z.string(),
  content_hash: z.string().nullable(),
  embedding_version: z.string(),
  metadata: z.record(z.any()).nullable(),
  created_by: z.string(),
  created_at: z.string(),
});
export type ExtendedMemoryEntryResponse = z.infer<typeof ExtendedMemoryEntrySchema>;