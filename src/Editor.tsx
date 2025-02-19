import {Container} from '@mantine/core';
import Canvas from "./components/Canvas.tsx";

export default function Editor() {
  return (
    <Container
      fluid
      display="grid"
      style={{
        justifyContent: 'center',
      }}
    >
      <Canvas/>
    </Container>
  );
}
