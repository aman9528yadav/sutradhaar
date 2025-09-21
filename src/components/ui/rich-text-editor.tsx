
"use client";

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default RichTextEditor;
