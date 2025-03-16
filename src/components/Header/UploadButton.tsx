import { Button, FileButton, Group } from "@mantine/core";
import { usePageStore } from "../../store/pageStore";

export default function UploadButton() {
  const addPage = usePageStore((state) => state.addPage);

  const handleImageUpload = async (uploadedFiles: File[]) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }

    // Process each uploaded file
    uploadedFiles.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      addPage(imageUrl);
    });
  };

  return (
    <Group justify="center">
      <FileButton
        onChange={handleImageUpload}
        accept="image/png,image/jpeg"
        multiple={true}
      >
        {(props) => <Button {...props}>Upload Image</Button>}
      </FileButton>
    </Group>
  );
}
