import Canvas from "./components/Canvas";
import { usePageStore } from "./store/pageStore";
import { Container } from "@mantine/core";

export default function Editor() {
  const pages = usePageStore(state => state.pages);
  const selectedPageKey = usePageStore(state => state.selectedPageKey);

  const selectedPage = pages.find((page) => page.key === selectedPageKey);
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
