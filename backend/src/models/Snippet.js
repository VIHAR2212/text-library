const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

/**
 * Snippet Schema
 * Stores text/code snippets with title, content, and metadata
 */
const snippetSchema = new mongoose.Schema(
  {
    // Short unique ID used in URLs (e.g. /snippet/abc12)
    shortId: {
      type: String,
      default: () => nanoid(8),
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [500000, 'Content cannot exceed 500,000 characters'],
    },
    // Auto-detected language for syntax highlighting (optional)
    language: {
      type: String,
      default: 'plaintext',
    },
    // View count for popularity sorting
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Text index for full-text search on title and content
snippetSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Snippet', snippetSchema);
