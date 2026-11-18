import { put } from '@vercel/blob';
import { createLeadHandler } from '../server/leads.js';

export default {
  fetch: createLeadHandler({ write: put, ready: () => Boolean(process.env.BLOB_READ_WRITE_TOKEN) }),
};
