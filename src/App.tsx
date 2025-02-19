import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import {AppShell, Burger, Group, MantineProvider, Button} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import Editor from './Editor.tsx';
import {theme} from './theme';
import MangaPagesList from "./components/MangaPagesList.tsx";
import Toolbar from "./components/Toolbar.tsx";

export default function App() {
  const [navbarOpen, {toggle: toggleNavbar}] = useDisclosure();
  const [asideOpen, {toggle: toggleAside}] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{height: 60}}
        navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !navbarOpen}}}
        aside={{width: 300, breakpoint: 'sm', collapsed: {mobile: !asideOpen}}}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Burger opened={navbarOpen} onClick={toggleNavbar} hiddenFrom="sm" size="sm"/>
            <Button onClick={toggleAside} variant="subtle" size="sm">
              Toggle Aside
            </Button>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <MangaPagesList/>
        </AppShell.Navbar>

        <AppShell.Aside p="md">
          <Toolbar/>
        </AppShell.Aside>

        <AppShell.Main>
          <Editor/>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};
