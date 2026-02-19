'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Heading2, Trash2, Image as ImageIcon, Trash } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: null,
              parseHTML: element => {
                const style = element.getAttribute('style');
                return style || null;
              },
              renderHTML: attributes => {
                if (!attributes.style) {
                  return {};
                }
                return {
                  style: attributes.style,
                };
              },
            },
          };
        },
        parseHTML() {
          return [
            {
              tag: 'img[src]',
              getAttrs: (node) => {
                if (typeof node === 'string') return false;
                return {
                  src: node.getAttribute('src'),
                  alt: node.getAttribute('alt') || '',
                  title: node.getAttribute('title') || '',
                  style: node.getAttribute('style'),
                };
              },
            },
          ];
        },
      }).configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
        inline: false,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Update editor content when navigating between steps
  useEffect(() => {
    if (!editor) return;

    const editorContent = editor.getHTML();
    const newContent = value || '';

    // Only update if content differs (handles navigation between steps)
    if (editorContent !== newContent && newContent) {
      editor.commands.setContent(newContent);
    }
  }, [value]);

  // Track focus state
  useEffect(() => {
    if (!editor) return;

    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    editor.on('focus', onFocus);
    editor.on('blur', onBlur);

    return () => {
      editor.off('focus', onFocus);
      editor.off('blur', onBlur);
    };
  }, [editor]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Use base64 directly as image src
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageFromUrl = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const resizeImage = (width: string) => {
    const widthPercent = width === '500px' ? '100%' : width === '375px' ? '75%' : width === '250px' ? '50%' : '33%';
    editor
      .chain()
      .focus()
      .updateAttributes('image', {
        style: `width: ${widthPercent}; height: auto;`
      })
      .run();
  };

  const deleteImage = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-600 rounded-t-lg p-3">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <div className="w-px bg-slate-600" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Bullet list"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Numbered list"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px bg-slate-600" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Heading"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded transition-colors bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          title="Upload image"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-px bg-slate-600" />

        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="p-2 rounded transition-colors bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          title="Clear formatting"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className={`bg-slate-900 border border-slate-600 rounded-b-lg transition-all ${isFocused ? 'ring-2 ring-indigo-500' : ''}`} onClick={() => editor.chain().focus().run()}>
        <EditorContent
          editor={editor}
          className="px-4 py-3 text-white outline-none min-h-32 [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_*]:break-words [&_p]:break-words [&_p]:word-wrap [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1 [&_a]:text-indigo-400 [&_a]:underline [&_a]:hover:text-indigo-300 [&_img]:rounded [&_img]:my-3 [&_img]:cursor-pointer"
        />
      </div>
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) => {
            return editor.isActive('image');
          }}
        >
          <div className="flex gap-2 bg-slate-800 border border-slate-600 rounded-lg p-2 shadow-lg">
            <button
              onClick={() => resizeImage('500px')}
              className="px-3 py-1 text-xs rounded transition-colors bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white"
              title="Full width"
            >
              Full
            </button>
            <button
              onClick={() => resizeImage('375px')}
              className="px-3 py-1 text-xs rounded transition-colors bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white"
              title="75% width"
            >
              Large
            </button>
            <button
              onClick={() => resizeImage('250px')}
              className="px-3 py-1 text-xs rounded transition-colors bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white"
              title="50% width"
            >
              Medium
            </button>
            <button
              onClick={() => resizeImage('166px')}
              className="px-3 py-1 text-xs rounded transition-colors bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white"
              title="33% width"
            >
              Small
            </button>
            <div className="w-px bg-slate-600" />
            <button
              onClick={deleteImage}
              className="px-2 py-1 text-xs rounded transition-colors bg-slate-700 text-red-400 hover:bg-red-600 hover:text-white"
              title="Delete image"
            >
              <Trash size={14} />
            </button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
};
