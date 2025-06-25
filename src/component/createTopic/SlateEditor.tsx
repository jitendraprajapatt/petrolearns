'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import {
  createEditor,
  Transforms,
  Editor,
  Element as SlateElement,
  Descendant,
  Range,
  Point,
  Path,
} from 'slate';
import { Slate, Editable, withReact, useSlate, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';

// Ensure CustomElement, CustomText, and EmptyText are imported from your types file
import { CustomElement, CustomText, EmptyText, ImageElement as ImageElementType, LinkElement as LinkElementType } from '@/type/slate';

import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiImage,
  FiList,
  FiCode,
} from 'react-icons/fi';
import { FaListOl } from 'react-icons/fa';
import { Heading1, Heading2, Heading3, Quote, LinkIcon, Trash2 } from 'lucide-react';

import customToast from '@/utils/toast';

interface SlateEditorProps {
  value: Descendant[];
  onChange: (val: Descendant[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function SlateEditor({
  value,
  onChange,
  placeholder = "Start typing your content here...",
  readOnly = false
}: SlateEditorProps) {
  const editor = useMemo(() => {
    return withImages(withLinks(withHistory(withReact(createEditor()))));
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    const element = props.element as CustomElement;

    switch (element.type) {
      case 'image':
        // Cast element to ImageElementType for type safety within ImageElement
        return <ImageElement {...props} element={element as ImageElementType} />;
      case 'link':
        // Cast element to LinkElementType for type safety within LinkElement
        return <LinkElement {...props} element={element as LinkElementType} />;
      case 'heading-one':
        return (
          <h1 {...props.attributes} className="text-3xl font-extrabold my-5 text-gray-900 leading-tight">
            {props.children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 {...props.attributes} className="text-2xl font-bold my-4 text-gray-800 leading-tight">
            {props.children}
          </h2>
        );
      case 'heading-three':
        return (
          <h3 {...props.attributes} className="text-xl font-semibold my-3 text-gray-700 leading-tight">
            {props.children}
          </h3>
        );
      case 'block-quote':
        return (
          <blockquote {...props.attributes} className="border-l-4 border-blue-400 pl-4 py-2 italic text-blue-700 bg-blue-50 rounded-r-lg my-3">
            {props.children}
          </blockquote>
        );
      case 'bulleted-list':
        return (
          <ul {...props.attributes} className="list-disc pl-8 my-2 space-y-1.5 text-gray-700">
            {props.children}
          </ul>
        );
      case 'numbered-list':
        return (
          <ol {...props.attributes} className="list-decimal pl-8 my-2 space-y-1.5 text-gray-700">
            {props.children}
          </ol>
        );
      case 'list-item':
        return <li {...props.attributes} className="leading-relaxed">{props.children}</li>;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} leaf={props.leaf as CustomText} />;
  }, []);

  // Handle keyboard shortcuts
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (readOnly) return;

    const { key, ctrlKey, metaKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    if (isCtrlOrCmd) {
      switch (key) {
        case 'b':
          event.preventDefault();
          toggleMark(editor, 'bold');
          break;
        case 'i':
          event.preventDefault();
          toggleMark(editor, 'italic');
          break;
        case 'u':
          event.preventDefault();
          toggleMark(editor, 'underline');
          break;
        case '`':
          event.preventDefault();
          toggleMark(editor, 'code');
          break;
        case 'k':
          event.preventDefault();
          handleInsertLink();
          break;
      }
    }

    // Handle Enter key for lists
    if (key === 'Enter') {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [match] = Editor.nodes(editor, {
          match: n => !Editor.isEditor(n) && SlateElement.isElement(n) &&
            ['bulleted-list', 'numbered-list'].includes((n as CustomElement).type),
        });

        if (match) {
          const [, path] = match;
          const [listItem] = Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) &&
              (n as CustomElement).type === 'list-item',
          });

          if (listItem) {
            const [listItemNode] = listItem;
            const isEmpty = Editor.string(editor, listItemNode as any) === '';

            if (isEmpty) {
              event.preventDefault();
              Transforms.unwrapNodes(editor, {
                match: n => !Editor.isEditor(n) && SlateElement.isElement(n) &&
                  ['bulleted-list', 'numbered-list'].includes((n as CustomElement).type),
                split: true,
              });
              Transforms.setNodes(editor, { type: 'paragraph' });
            }
          }
        }
      }
    }
  }, [editor, readOnly]);

  const handleInsertLink = useCallback(() => {
    const url = window.prompt('Enter the URL:');
    if (!url) return;

    if (editor.selection) {
      const selectedText = Editor.string(editor, editor.selection);
      insertLink(editor, url, selectedText);
    } else {
      const text = window.prompt('Enter the link text:', 'link');
      if (text !== null) {
        insertLink(editor, url, text);
      }
    }
  }, [editor]);

  if (readOnly) {
    return (
      <div className="w-full h-full">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <Slate editor={editor} initialValue={value} onChange={() => { }}>
            <Editable
              className="p-6 text-gray-800 leading-relaxed overflow-y-auto focus:outline-none custom-scrollbar"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              readOnly
            />
          </Slate>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col flex-grow min-h-0">
        <Slate editor={editor} initialValue={value} onChange={onChange}>
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 sticky top-0 z-10 flex flex-wrap gap-2 items-center flex-shrink-0">
            <ToolbarGroup>
              <ToolbarButton format="bold" icon={<FiBold size={18} />} type="mark" tooltip="Bold (Ctrl+B)" />
              <ToolbarButton format="italic" icon={<FiItalic size={18} />} type="mark" tooltip="Italic (Ctrl+I)" />
              <ToolbarButton format="underline" icon={<FiUnderline size={18} />} type="mark" tooltip="Underline (Ctrl+U)" />
              <ToolbarButton format="code" icon={<FiCode size={18} />} type="mark" tooltip="Inline Code (Ctrl+`)" />
            </ToolbarGroup>
            <Divider />
            <ToolbarGroup>
              <ToolbarButton format="heading-one" icon={<Heading1 size={18} />} type="block" tooltip="Heading 1" />
              <ToolbarButton format="heading-two" icon={<Heading2 size={18} />} type="block" tooltip="Heading 2" />
              <ToolbarButton format="heading-three" icon={<Heading3 size={18} />} type="block" tooltip="Heading 3" />
              <ToolbarButton format="block-quote" icon={<Quote size={18} />} type="block" tooltip="Block Quote" />
            </ToolbarGroup>
            <Divider />
            <ToolbarGroup>
              <ToolbarButton format="bulleted-list" icon={<FiList size={18} />} type="block" tooltip="Bulleted List" />
              <ToolbarButton format="numbered-list" icon={<FaListOl size={18} />} type="block" tooltip="Numbered List" />
            </ToolbarGroup>
            <Divider />
            <ToolbarGroup>
              <InsertImageButton editor={editor} />
              <InsertLinkButton editor={editor} onInsert={handleInsertLink} />
            </ToolbarGroup>
          </div>
          <Editable
            className="flex-1 p-6 text-gray-800 leading-relaxed overflow-y-auto focus:outline-none custom-scrollbar"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus
            onKeyDown={onKeyDown}
          />
        </Slate>
      </div>
    </div>
  );
}

const ToolbarGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-1.5">{children}</div>
);

const Divider: React.FC = () => (
  <div className="h-8 border-l border-gray-300 mx-1"></div>
);

interface ToolbarButtonProps {
  format: string;
  icon: React.ReactNode;
  type: 'mark' | 'block';
  tooltip?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  format,
  icon,
  type,
  tooltip,
}) => {
  const editor = useSlate();
  const isActive =
    type === 'mark'
      ? isMarkActive(editor, format as keyof CustomText)
      : isBlockActive(editor, format as CustomElement['type']);

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (type === 'mark') {
      toggleMark(editor, format as keyof CustomText);
    } else {
      toggleBlock(editor, format as CustomElement['type']);
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onMouseDown={onMouseDown}
        className={`p-2.5 rounded-lg transition-colors duration-200 ease-in-out
                     ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}
        aria-label={String(format)}
      >
        {icon}
      </button>
      {tooltip && (
        <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as CustomText)[format] === true : false;
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: CustomElement['type']) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && (n as CustomElement).type === format,
  });
  return !!match;
};

const LIST_TYPES: CustomElement['type'][] = ['numbered-list', 'bulleted-list'];
const NON_TOGGLEABLE_BLOCK_TYPES: CustomElement['type'][] = ['image', 'link'];

const toggleBlock = (editor: Editor, format: CustomElement['type']) => {
  if (NON_TOGGLEABLE_BLOCK_TYPES.includes(format)) {
    console.warn(`Attempted to toggle void/special block type '${format}' using toggleBlock. Use a dedicated insert function instead.`);
    return;
  }

  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as CustomElement).type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement;
    Transforms.wrapNodes(editor, block);
  }
};

const DefaultElement: React.FC<RenderElementProps> = ({ attributes, children }) => (
  <p {...attributes} className="my-2 text-gray-700 leading-relaxed">
    {children}
  </p>
);

interface LeafProps extends RenderLeafProps {
  leaf: CustomText;
}

const Leaf: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong className="font-bold">{children}</strong>;
  if (leaf.italic) children = <em className="italic">{children}</em>;
  if (leaf.underline) children = <u className="underline">{children}</u>;
  if (leaf.code) children = <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm">{children}</code>;

  return <span {...attributes}>{children}</span>;
};

// Use the specific ImageElementType from your types for better safety
interface ImageElementProps extends RenderElementProps {
  element: ImageElementType; // Use the imported type
}

const ImageElement: React.FC<ImageElementProps> = ({ attributes, children, element }) => {
  const editor = useSlate();

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path });
  };

  return (
    <div {...attributes} className="my-5 relative group" contentEditable={false}>
      <div className="flex justify-center">
        <img
          src={element.url}
          alt={element.alt || 'Embedded content'} // Ensure alt is used, fallback if somehow empty
          className="max-w-full h-auto max-h-72 rounded-lg shadow-lg border border-gray-300 object-contain hover:scale-[1.01] transition-transform duration-200"
        />
      </div>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
        aria-label="Delete image"
      >
        <Trash2 size={14} />
      </button>
      {children}
    </div>
  );
};

// Use the specific LinkElementType from your types for better safety
interface LinkElementProps extends RenderElementProps {
  element: LinkElementType; // Use the imported type
}

const LinkElement: React.FC<LinkElementProps> = ({ attributes, children, element }) => {
  const editor = useSlate();

  const handleEdit = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newUrl = window.prompt('Edit URL:', element.url);
      if (newUrl && newUrl !== element.url) {
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(editor, { url: newUrl }, { at: path });
      }
    }
  };

  return (
    <a
      {...attributes}
      href={element.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleEdit}
      className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200 cursor-pointer"
      style={{
        boxShadow: '0 1px 0 0 currentColor',
        wordBreak: 'break-word'
      }}
      title={`${element.url} (Ctrl+Click to edit)`}
    >
      {children}
    </a>
  );
};

const withImages = (editor: Editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    if (SlateElement.isElement(element)) {
      const customElement = element as CustomElement;
      return customElement.type === 'image' || isVoid(element);
    }
    return isVoid(element);
  };

  editor.insertData = (data) => {
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          if (file.size <= 5 * 1024 * 1024) { // 5MB limit
            const reader = new FileReader();
            reader.onload = () => {
              const imageUrl = reader.result as string;
              insertImage(editor, imageUrl);
            };
            reader.onerror = () => {
              customToast('Error reading image file', 'error');
            };
            reader.readAsDataURL(file);
          } else {
            customToast(`Image "${file.name}" exceeds the 5MB limit and was skipped.`, 'error');
          }
        } else {
          customToast(`File "${file.name}" is not an image and was skipped.`, 'error');
        }
      }
    } else {
      insertData(data);
    }
  };

  return editor;
};

const withLinks = (editor: Editor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    if (SlateElement.isElement(element)) {
      const customElement = element as CustomElement;
      return customElement.type === 'link' || isInline(element);
    }
    return isInline(element);
  };

  // Ensure isVoid for links is handled by the default Slate isVoid or combined with other custom voids
  // Typically, links are inline and not void unless specified, but if your LinkElement is intended to be void, keep this.
  // Based on common Slate patterns, links are usually inline non-void elements.
  // If LinkElement is not void, you might remove 'link' from this check, or ensure your 'isVoid' function from 'withImages' handles it.
  editor.isVoid = (element) => {
    if (SlateElement.isElement(element)) {
      const customElement = element as CustomElement;
      return customElement.type === 'image' || isVoid(element); // Only image is void in this current setup
    }
    return isVoid(element);
  };


  return editor;
};

// ** CORRECTED insertImage function **
const insertImage = (editor: Editor, url: string) => {
  if (!url) {
    console.error("Attempted to insert image with empty URL.");
    return;
  }

  // Create the image node with explicit type assertion for children and alt property
  const imageNode: ImageElementType = {
    type: 'image',
    url,
    alt: '', // Add the 'alt' property. Provide a meaningful alt text if available.
    children: [{ text: '' } as EmptyText] // Ensure children is an array of EmptyText
  };

  Transforms.insertNodes(editor, imageNode);
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }]
  });
  Transforms.move(editor);
  ReactEditor.focus(editor);
};

const insertLink = (editor: Editor, url: string, text?: string) => {
  if (!url) return;

  const { selection } = editor;
  const linkText = text || (selection ? Editor.string(editor, selection) : 'link') || 'link';

  if (selection && Range.isExpanded(selection)) {
    Transforms.wrapNodes(
      editor,
      { type: 'link', url, children: [{ text: linkText }] },
      { split: true, at: selection }
    );
  } else {
    const linkNode: CustomElement = {
      type: 'link',
      url,
      children: [{ text: linkText }]
    };

    Transforms.insertNodes(editor, linkNode);
  }

  Transforms.move(editor);
  ReactEditor.focus(editor);
};

interface InsertImageButtonProps {
  editor: Editor;
}

const InsertImageButton: React.FC<InsertImageButtonProps> = ({ editor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        const reader = new FileReader();

        reader.onload = () => {
          const imageUrl = reader.result as string;
          insertImage(editor, imageUrl);
        };

        reader.onerror = () => {
          customToast(`Error reading image "${file.name}".`, 'error');
        };

        reader.readAsDataURL(file);
      } else {
        customToast(`Image "${file.name}" exceeds the 5MB limit.`, 'error');
      }
    } else if (file) {
      customToast(`File "${file.name}" is not an image.`, 'error');
    }

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          handleInsertImage();
        }}
        className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
        aria-label="Insert image"
      >
        <FiImage size={18} />
      </button>
      <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Insert Image
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

interface InsertLinkButtonProps {
  editor: Editor;
  onInsert: () => void;
}

const InsertLinkButton: React.FC<InsertLinkButtonProps> = ({ editor, onInsert }) => {
  return (
    <div className="relative group">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsert();
        }}
        className={`p-2.5 rounded-lg transition-colors duration-200 ${
          isBlockActive(editor, 'link')
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }`}
        aria-label="Insert link"
      >
        <LinkIcon size={18} />
      </button>
      <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Insert Link (Ctrl+K)
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};