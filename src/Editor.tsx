import Canvas from "./components/Canvas";
import { usePageContext } from "./contexts/PageContext";
import { Container } from "@mantine/core";

export default function Editor() {
  const { pages, selectedPageKey } = usePageContext();

  const selectedPage = pages.find(page => page.key === selectedPageKey);
  const imageURL = selectedPage?.sourceImage;
  const textBoxes = selectedPage?.textBoxes || [];
  const lines = selectedPage?.lines || [];


  return (
    <Container fluid style={{ height: '100%', overflow: 'hidden' }}>
      <Canvas
        imageURL={imageURL || undefined}
        initialTextBoxes={textBoxes}
        initialLines={lines}
      />
    </Container>
  );
}
