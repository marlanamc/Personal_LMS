'use client';

import React, { forwardRef } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  MDXEditorMethods,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

interface ThoughtDownloadEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  showToolbar?: boolean;
}

const ThoughtDownloadEditor = forwardRef<MDXEditorMethods, ThoughtDownloadEditorProps>(
  function ThoughtDownloadEditor({ markdown, onChange, disabled, showToolbar = false }, ref) {
  return (
    <div
      className={`w-full min-h-full flex-1 flex flex-col overflow-hidden ${!showToolbar ? 'toolbar-collapsed' : ''}`}
      data-toolbar-visible={showToolbar}
    >
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
            markdownShortcutPlugin(),
            diffSourcePlugin({ viewMode: 'rich-text' }),
            toolbarPlugin({
              toolbarContents: () => (
                <DiffSourceToggleWrapper options={['rich-text', 'source']}>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle options={['bullet', 'number', 'check']} />
                  <BlockTypeSelect />
                </DiffSourceToggleWrapper>
              ),
              toolbarClassName: 'flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border-subtle/60 bg-bg-surface/50',
            }),
          ]}
        />
    </div>
  );
});

export default ThoughtDownloadEditor;
