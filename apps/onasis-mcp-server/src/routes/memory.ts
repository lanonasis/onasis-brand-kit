/*
 * Memory API routes.
 *
 * This module defines HTTP route handlers for the memory service
 * endpoints described in the architecture plan: ingest, reembed,
 * retrieve, context, feedback, entry retrieval and delete/purge.
 *
 * Each handler uses Zod schemas to validate the request body and
 * delegates to a MemoryService (assumed to be implemented elsewhere)
 * for the core logic. Responses are returned in a consistent JSON
 * format. Errors are caught and reported with a 400 status.
 */

import { Router, Request, Response } from 'express';
import {
  IngestRequestSchema,
  IngestResponseSchema,
  ReembedRequestSchema,
  ReembedResponseSchema,
  RetrieveRequestSchema,
  RetrieveResponseSchema,
  ContextRequestSchema,
  ContextResponseSchema,
  FeedbackRequestSchema,
  FeedbackResponseSchema,
  DeletePurgeRequestSchema,
  DeletePurgeResponseSchema,
  ExtendedMemoryEntrySchema,
} from '../types/extended-memory';

// Placeholder MemoryService interface; implement in service layer
interface MemoryService {
  ingest: (req: any, user: any) => Promise<any>;
  reembed: (req: any, user: any) => Promise<any>;
  retrieve: (req: any, user: any) => Promise<any>;
  context: (req: any, user: any) => Promise<any>;
  getEntry: (id: string, user: any) => Promise<any>;
  feedback: (req: any, user: any) => Promise<any>;
  deleteOrPurge: (req: any, user: any) => Promise<any>;
}

export default function createMemoryRouter(memoryService: MemoryService) {
  const router = Router();

  // Utility to extract user from request (assumes JWT claims have been
  // parsed upstream and attached to req.user). Adjust as needed.
  function getUser(req: Request) {
    return (req as any).user || {};
  }

  // POST /ingest
  router.post('/ingest', async (req: Request, res: Response) => {
    try {
      const parseResult = IngestRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
      }
      const result = await memoryService.ingest(parseResult.data, getUser(req));
      const validation = IngestResponseSchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid ingest response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  // POST /reembed
  router.post('/reembed', async (req: Request, res: Response) => {
    try {
      const parseResult = ReembedRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
      }
      const result = await memoryService.reembed(parseResult.data, getUser(req));
      const validation = ReembedResponseSchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid reembed response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  // POST /retrieve
  router.post('/retrieve', async (req: Request, res: Response) => {
    try {
      const parseResult = RetrieveRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
      }
      const result = await memoryService.retrieve(parseResult.data, getUser(req));
      const validation = RetrieveResponseSchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid retrieve response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  // POST /context
  router.post('/context', async (req: Request, res: Response) => {
    try {
      const parseResult = ContextRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
      }
      const result = await memoryService.context(parseResult.data, getUser(req));
      const validation = ContextResponseSchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid context response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  // GET /entries/:id
  router.get('/entries/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await memoryService.getEntry(id, getUser(req));
      const validation = ExtendedMemoryEntrySchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid entry response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  // POST /feedback
  router.post('/feedback', async (req: Request, res: Response) => {
    try {
      const parseResult = FeedbackRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
      }
      const result = await memoryService.feedback(parseResult.data, getUser(req));
      const validation = FeedbackResponseSchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid feedback response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  // POST /delete or /purge
  router.post(['/delete', '/purge'], async (req: Request, res: Response) => {
    try {
      const parseResult = DeletePurgeRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
      }
      // Mark purge true if hitting /purge endpoint
      const path = req.path.endsWith('/purge');
      const requestPayload = { ...parseResult.data, purge: path || parseResult.data.purge };
      const result = await memoryService.deleteOrPurge(requestPayload, getUser(req));
      const validation = DeletePurgeResponseSchema.safeParse(result);
      if (!validation.success) {
        return res.status(500).json({ error: 'Invalid delete/purge response shape' });
      }
      return res.json(validation.data);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  return router;
}