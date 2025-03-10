import {Stack, Container, Paper, Image, Text} from '@mantine/core';
import { usePageStore } from "../store/pageStore";
import React from "react";

interface PageEntryProps {
  page: any; // will be Page interface, but avoid import cycle for now
}

const PageEntry: React.FC<PageEntryProps> = ({ page }) => {
  const selectPage = usePageStore(state => state.selectPage);
  const selectedPageKey = usePageStore(state => state.selectedPageKey);
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
  const pages = usePageStore(state => state.pages);

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
