"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-amber underline font-medium" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-h-80 object-cover my-4" } }),
      Placeholder.configure({ placeholder: "Empieza a redactar el contenido del curso, congreso o noticia técnica…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[340px] p-6 outline-none text-[15px] leading-relaxed text-graphite focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-graphite/70 [&_blockquote]:my-3 [&_hr]:my-5 [&_hr]:border-black/10",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return <div className="min-h-[380px] rounded-2xl bg-bone animate-pulse" />;

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${active ? "bg-graphite text-white" : "text-graphite/70 hover:bg-black/5 hover:text-graphite"}`;

  const addLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("URL del enlace:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || "");
      if (src) editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-xs">
      {/* Toolbar profesional tipo Gutenberg / Notion */}
      <div className="bg-[#f8f9fb] border-b border-black/10 px-3 py-2 flex flex-wrap items-center gap-1">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}>H3</button>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>Negrita</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>Cursiva</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))}>Tachado</button>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>• Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>1. Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}>❝ Cita</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>― Línea</button>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <button type="button" onClick={addLink} className={btn(editor.isActive("link"))}>🔗 Enlace</button>
        <label className={`${btn(false)} cursor-pointer`}>
          🖼 Imagen
          <input type="file" accept="image/*" onChange={addImage} className="hidden" />
        </label>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="px-2 py-1 text-xs text-graphite/50 hover:text-graphite disabled:opacity-30" title="Deshacer">↶</button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="px-2 py-1 text-xs text-graphite/50 hover:text-graphite disabled:opacity-30" title="Rehacer">↷</button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
