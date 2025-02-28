// components/Header/UploadButton.tsx
import {Button, FileButton, Group} from '@mantine/core';
import {usePageContext} from "../../contexts/PageContext";

export default function UploadButton() {
  const { addPage } = usePageContext();

  const handleImageUpload = async (uploadedFiles: File[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }

    const file = uploadedFiles[0]; // Assuming single file upload for now
    const imageUrl = URL.createObjectURL(file);

    const newPage = {
      name: `Page ${Date.now()}`, // Or generate a more user-friendly name
      order: Date.now(), // Or determine order based on existing pages
      sourceImage: imageUrl,
      textBoxes: [],
      segmentData: [],
      lines: [],
    };
    addPage(newPage);
  };


  return (
    <>
      <Group justify="center">
        <FileButton onChange={(files) => handleImageUpload(files)} accept="image/png,image/jpeg" multiple={false}>
          {(props) => <Button {...props}>Upload Image</Button>}
        </FileButton>
      </Group>
    </>
  );
}
