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
  return (
    <div className="w-full min-h-full flex-1 flex flex-col overflow-hidden">
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      readOnly={disabled}
      contentEditableClassName="prose prose-sm max-w-none focus:outline-none min-h-full w-full p-6 text-text"
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
}
