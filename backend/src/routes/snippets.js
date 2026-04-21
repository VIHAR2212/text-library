const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const supabase = require('../config/supabase');

/**
 * GET /api/snippets
 * Fetch snippets with optional search + pagination
 * Query params: ?search=query&page=1&limit=12
 */
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('snippets')
      .select('id, short_id, title, content, language, views, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Search by title or content
    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search.trim()}%,content.ilike.%${search.trim()}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      snippets: data.map(normalise),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Error fetching snippets:', err);
    res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});

/**
 * GET /api/snippets/:shortId
 * Get one snippet and increment view count
 */
router.get('/:shortId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('snippets')
      .select('*')
      .eq('short_id', req.params.shortId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Snippet not found' });

    // Increment views
    await supabase
      .from('snippets')
      .update({ views: (data.views || 0) + 1 })
      .eq('short_id', req.params.shortId);

    res.json(normalise({ ...data, views: (data.views || 0) + 1 }));
  } catch (err) {
    console.error('Error fetching snippet:', err);
    res.status(500).json({ error: 'Failed to fetch snippet' });
  }
});

/**
 * POST /api/snippets
 * Create a new snippet — only title + content required
 */
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!content || !content.trim()) return res.status(400).json({ error: 'Content is required' });

    const { data, error } = await supabase
      .from('snippets')
      .insert({
        short_id: nanoid(8),
        title: title.trim(),
        content: content.trim(),
        views: 0,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalise(data));
  } catch (err) {
    console.error('Error creating snippet:', err);
    res.status(500).json({ error: 'Failed to create snippet' });
  }
});

/**
 * DELETE /api/snippets/:shortId
 */
router.delete('/:shortId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('snippets')
      .delete()
      .eq('short_id', req.params.shortId);

    if (error) throw error;
    res.json({ message: 'Snippet deleted successfully' });
  } catch (err) {
    console.error('Error deleting snippet:', err);
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
});

/**
 * Normalise Supabase row to match frontend expectations
 * (converts snake_case to camelCase + adds shortId alias)
 */
function normalise(row) {
  return {
    _id: row.id,
    shortId: row.short_id,
    title: row.title,
    content: row.content,
    language: row.language || 'plaintext',
    views: row.views || 0,
    createdAt: row.created_at,
  };
}

module.exports = router;
