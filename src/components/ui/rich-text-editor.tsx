"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
