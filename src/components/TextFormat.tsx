import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2>'

export default function TextFormat () {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

    </RichTextEditor>
  );
}
