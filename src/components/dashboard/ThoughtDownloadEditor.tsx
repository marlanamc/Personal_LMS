'use client';

import React from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditorMethods,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface ThoughtDownloadEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  disabled?: boolean;
}

export default function ThoughtDownloadEditor({
  markdown,
  onChange,
  editorRef,
  disabled
}: ThoughtDownloadEditorProps) {
  // Only use plugins we want, primarily lists and basic typography for Thought Download.
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      readOnly={disabled}
      contentEditableClassName="prose prose-sm max-w-none focus:outline-none min-h-[320px] p-4 text-text"
      className="mdxeditor-theme-custom w-full flex-1 rounded-2xl border border-border-subtle bg-bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-colors"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin() // This enables things like typing "- [ ] " to make a checklist!
      ]}
    />
  );
}
