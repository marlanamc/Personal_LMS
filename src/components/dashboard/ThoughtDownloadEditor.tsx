'use client';

import React, { forwardRef } from 'react';
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
  disabled?: boolean;
}

const ThoughtDownloadEditor = forwardRef<MDXEditorMethods, ThoughtDownloadEditorProps>(
  function ThoughtDownloadEditor({ markdown, onChange, disabled }, ref) {
  return (
    <div className="w-full min-h-full flex-1 flex flex-col overflow-hidden">
    <MDXEditor
      ref={ref}
      markdown={markdown}
      onChange={onChange}
      readOnly={disabled}
      contentEditableClassName="prose prose-base max-w-none focus:outline-none min-h-full w-full p-6 text-text"
      className="mdxeditor-theme-custom w-full min-h-full flex-1 flex flex-col overflow-hidden"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin() // This enables things like typing "- [ ] " to make a checklist!
      ]}
    />
    </div>
  );
});

export default ThoughtDownloadEditor;
