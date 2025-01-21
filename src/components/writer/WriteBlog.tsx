"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, ImagePlus, Italic, List } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "@tiptap/extension-image";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import blogStore from "@/store/writer/blog/blogStore";
import { Select, SelectItem } from "@heroui/select";
// import { slugify } from "@/utils/index";

const WriteBlog = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("")
  const [thumbnailImage, setThumbnailImage] = useState("")
  const [category, setCategory] = useState("")
  // console.log(category);

  const { writeBlog } = blogStore()
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const slugify = (str: string) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLocaleLowerCase()
    str = str.replace(/[^a-z0-9 -]/g, '') // remove non alpha numerics
      .replace(/\s+/g, '-') // replace with hypens
      .replace(/-+/g, '-');
    return str
  }

  useEffect(() => {
    const str = title
    const slugs = slugify(str)
    setSlug(slugs)
  }, [handleChange, title])

  // Create editor
  const editor = useEditor({
    extensions: [StarterKit, Image],
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const bold = () => {
    if (!editor) {
      return <>No editor found</>;
    }
    editor.chain().focus().toggleBold().run();
  };
  //ITALIC
  const italic = () => {
    if (!editor) {
      return <div>No editor found.</div>;
    }
    editor.chain().focus().toggleItalic().run();
  };
  //LIST
  const list = () => {
    if (!editor) {
      return <div>No editor found.</div>;
    }
    editor.chain().focus().toggleBulletList().run();
  };
  //IMAGE
  const image = useCallback(() => {
    if (!editor) {
      return <div>No editor found.</div>;
    }

    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
  //if no editor return null
  if (!editor) {
    return null;
  }

  const createBlog = async () => {
    try {
      await writeBlog(title, slug, thumbnailImage, content, category)
    } catch (error) {
      console.log(error);
    }
  }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return <>something went wrong</>;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/writer/blog/upload-image", {
        method: "POST",
        body: formData,
      });

      const resposne = await res.json();
      if (resposne.success === true) {
        const imageUrl = resposne.url;
        setThumbnailImage(imageUrl)
      }
    } catch (error) {
      console.log(error);
    }
  }


  const blogCategory = [
    { key: "fitness", label: "Fitness" },
    { key: "mental_health", label: "Mental Health" },
    { key: "finance", label: "Finance" }
  ]

  return (
    <div className="px-8 py-4">
      <div>
        <Input placeholder="Title for this blog" label="Title" labelPlacement="outside" size="lg" onChange={handleChange} />
      </div>
      <div>
        <Input placeholder="slug" label="Slug" labelPlacement="outside" size="lg" value={slug} />
      </div>
      <div>
        <Input type="file" label="Thumbnail" labelPlacement="outside" size="lg" onChange={uploadFile} />
      </div>
      <div>
        <Select className="max-w-xs" label="Category" placeholder="Select an category" onChange={(e) => setCategory(e.target.value)}>
          {blogCategory.map((category) => (
            <SelectItem key={category.key}>{category.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <label>Enter content</label>
        <EditorContent editor={editor} />
      </div>
      <div className="mt-2 space-x-1">
        <button
          className="bg-black text-white rounded px-1"
          onClick={bold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold />
        </button>
        <button
          className="bg-black text-white rounded px-1"
          onClick={italic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic />
        </button>
        <button
          className="bg-black text-white rounded px-1"
          onClick={list}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
        >
          <List />
        </button>
        <button className="bg-black text-white rounded px-1" onClick={image}>
          <ImagePlus />
        </button>
      </div>
      <div className="mt-2">
        {
          <Button onPress={createBlog} color="success" size="lg" className="text-white font-semibold">Create blog</Button>
        }
      </div>
    </div>
  );
};

export default WriteBlog;