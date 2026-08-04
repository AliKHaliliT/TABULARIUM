import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import TurndownService from "turndown";
import Showdown from "showdown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

const converter = new Showdown.Converter({
  noHeaderId: true,
  simplifiedAutoLink: true,
});

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

/**
 * A rich-text field that round-trips through Markdown.
 *
 * The record is stored as Markdown, so this edits HTML and converts on the way
 * in and out. The builder's own editor keeps HTML instead, because a resume
 * needs alignment and underline that Markdown cannot express.
 */
export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  // Quill's HTML is the working state; the markdown `value` prop reseeds it
  // only when it changes from the outside. Tracking the markdown we last
  // emitted lets us tell the parent echoing our own onChange apart from a
  // genuine external change: deterministically, unlike the previous 100ms
  // timer flag, which fast typing could outrun (clobbering editor content).
  const [lastEmitted, setLastEmitted] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState(() =>
    value ? converter.makeHtml(value) : ""
  );

  const [seededFrom, setSeededFrom] = useState(value);
  if (value !== seededFrom) {
    setSeededFrom(value);
    if (value !== lastEmitted) {
      setHtmlContent(value ? converter.makeHtml(value) : "");
    }
  }

  const handleChange = (content: string) => {
    setHtmlContent(content);
    const markdown = turndownService.turndown(content);
    setLastEmitted(markdown);
    onChange(markdown);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="h-64 flex flex-col">
      <ReactQuill
        theme="snow"
        value={htmlContent}
        onChange={handleChange}
        modules={modules}
        className="h-full flex flex-col"
        placeholder="Start writing..."
      />
    </div>
  );
};
