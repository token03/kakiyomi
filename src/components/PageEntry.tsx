import {Text, Paper, Anchor} from "@mantine/core";

interface PageEntryProps {
  page: number; // Or string, depending on your actual page type
}

export default function PageEntry({page}: PageEntryProps) {
  return (
    <Paper
      key={page}
      shadow="sm"
      p="sm"
      radius="md"
      style={{
        textAlign: 'center',
        width: "200px",
      }}
    >
      <Anchor
        target="_blank"
        rel="noopener noreferrer"
        underline="always"
        style={{
          color: "black",
        }}
        truncate={"end"}
      >
        <Text size="md">test{page}.png</Text>
      </Anchor>
    </Paper>
  );
}
