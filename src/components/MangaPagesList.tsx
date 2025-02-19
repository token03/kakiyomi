import {Stack, Container} from '@mantine/core';
import PageEntry from "./PageEntry.tsx";

export default function MangaPagesList() {
  // Create an array of placeholder pages (for example, 5 pages)
  const pages = Array.from({length: 5}, (_, i) => i + 1);

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
        {pages.map((page) => (
          <PageEntry page={page}/>
        ))}
      </Stack>
    </Container>
  );
};
