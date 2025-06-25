// src/type/slate.ts (or slate.d.ts)

import { Descendant, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history'; // Import if you use withHistory somewhere else

// Define your custom elements
export type HeadingOneElement = { type: 'heading-one'; children: CustomText[] };
export type HeadingTwoElement = { type: 'heading-two'; children: CustomText[] };
export type HeadingThreeElement = { type: 'heading-three'; children: CustomText[] };
export type BulletedListElement = { type: 'bulleted-list'; children: CustomElement[] }; // List elements contain other elements
export type NumberedListElement = { type: 'numbered-list'; children: CustomElement[] }; // List elements contain other elements
export type ListItemElement = { type: 'list-item'; children: CustomText[] };
export type BlockQuoteElement = { type: 'block-quote'; children: CustomText[] };
export type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
export type LinkElement = { type: 'link'; url: string; children: CustomText[] };

// *** THIS IS THE CRUCIAL PART: Add 'alt' to ImageElement ***
export type ImageElement = {
  type: 'image';
  url: string;
  alt: string; // <-- Add this line!
  children: EmptyText[]; // Void elements in Slate still need 'children'
};

// Union of all your custom block elements
export type CustomElement =
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | BlockQuoteElement
  | ParagraphElement
  | ImageElement
  | LinkElement; // Don't forget LinkElement if you have it!

// Define custom text properties (inline styles)
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean; // Add 'code' if you use it in your Leaf component
};

// For void elements like Image, their children array typically contains an empty text node
export type EmptyText = {
  text: '';
};


// Extend Slate's built-in types to include your custom types
// This is critical for TypeScript to correctly infer types when working with Slate elements.
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor; // Add HistoryEditor if you use withHistory
    Element: CustomElement;
    Text: CustomText | EmptyText; // Include EmptyText for void elements
  }
}