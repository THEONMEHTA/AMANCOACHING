import { put, get } from '@vercel/blob';
import { createLeadHandler } from '../server/leads.js';

export default {
  fetch: createLeadHandler({
    write: put,
    read: async pathname => {
      const existing = await get(pathname, { access: 'private', useCache: false });
      return existing?.statusCode === 200 ? new Response(existing.stream).json() : null;
    },
    ready: () => Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  }),
};
