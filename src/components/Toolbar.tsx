import {Container, Stack, TextInput, Text} from '@mantine/core';
import TextFormat from "./TextFormat.tsx";

export default function Toolbar() {
  return (
    <Container
      fluid
      style={{
        border: '2px solid black', // Black border added
        padding: '16px',
        borderRadius: '8px', // Rounded corners for a smoother look
      }}
    >
      <Stack>
        <TextInput label="Japanese" placeholder="Enter Japanese text"/>
        <Text size="sm">English</Text>
        <TextFormat/>
      </Stack>
    </Container>
  );
};
