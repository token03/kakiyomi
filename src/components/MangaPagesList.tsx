import {Stack, Container, Paper, Image, Text} from '@mantine/core';
import { usePageContext } from "../contexts/PageContext";
import React from "react";

interface PageEntryProps {
  page: any; // will be Page interface, but avoid import cycle for now
}

const PageEntry: React.FC<PageEntryProps> = ({ page }) => {
  const { selectPage, selectedPageKey } = usePageContext();
  const isSelected = page.key === selectedPageKey;

  return (
    <Paper
      shadow={isSelected ? "md" : "sm"}
      radius="md"
      style={{
        backgroundColor: isSelected ? '#f0f0f0' : 'white', // Example selection styling
        cursor: 'pointer',
        border: isSelected ? '2px solid blue' : '1px solid #ddd',
      }}
      onClick={() => selectPage(page.key)}
    >
      <Stack align="center">
        <Image src={page.sourceImage} height={200} fit="contain" radius="md" />
        <Text size="sm">{page.name || 'Page ' + page.order}</Text>
      </Stack>
    </Paper>
  );
};


export default function MangaPagesList() {
  const { pages } = usePageContext();

  return (
    <Container
      fluid
      style={{
        border: '2px solid black',
        padding: '16px',
        borderRadius: '8px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Stack>
        {pages.map((page) => (
          <PageEntry key={page.key} page={page}/>
        ))}
      </Stack>
    </Container>
  );
};
