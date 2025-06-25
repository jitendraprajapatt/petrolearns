import React, { useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import { CustomElement } from '@/type/slate';

const Element = (props: RenderElementProps) => {
  const { element, attributes, children } = props;
  const customElement = element as CustomElement;

  switch (customElement.type) {
    case 'heading-one':
      return (
        <h1
          {...attributes}
          className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0"
        >
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2
          {...attributes}
          className="text-2xl font-semibold text-gray-800 mb-5 mt-7"
        >
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3
          {...attributes}
          className="text-xl font-medium text-gray-800 mb-4 mt-6"
        >
          {children}
        </h3>
      );
    case 'bulleted-list':
      return (
        <ul
          {...attributes}
          className="list-disc list-inside pl-6 space-y-2 mb-4"
        >
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol
          {...attributes}
          className="list-decimal list-inside pl-6 space-y-2 mb-4"
        >
          {children}
        </ol>
      );
    case 'list-item':
      return (
        <li {...attributes} className="mb-1 pl-1">
          {children}
        </li>
      );
    case 'block-quote':
      return (
        <blockquote
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"
        >
          {children}
        </blockquote>
      );
    case 'image':
      return (
        <div
          {...attributes}
          contentEditable={false}
          className="my-6 flex justify-center"
        >
          <img
            src={customElement.url}
            alt={customElement.alt || ''}
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '500px' }}
          />
        </div>
      );
    case 'link':
      return (
        <a
          {...attributes}
          href={customElement.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    default:
      return (
        <p
          {...attributes}
          className="text-base text-gray-800 leading-relaxed mb-4"
        >
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.code) {
    children = <code className="bg-gray-100 px-1 rounded">{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};

const ReadOnlySlateViewer: React.FC<{ content: Descendant[] }> = ({ content }) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    // Added a container div with w-full to ensure it always takes the available width
    // and max-w-full to prevent overflow within its parent.
    <div className="w-full max-w-full overflow-auto">
      <Slate editor={editor} initialValue={content}>
        <Editable
          readOnly
          renderElement={(props) => <Element {...props} />}
          renderLeaf={(props) => <Leaf {...props} />}
          // 'prose' class from @tailwindcss/typography plugin is excellent for rendering rich text.
          // 'max-w-none' removes the default max-width the 'prose' class adds,
          // allowing it to fill its parent's width.
          className="prose max-w-none"
        />
      </Slate>
    </div>
  );
};

export default ReadOnlySlateViewer;