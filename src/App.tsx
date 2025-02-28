import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import {AppShell, Burger, Group, MantineProvider, Transition} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import Editor from './Editor.tsx';
import {theme} from './theme';
import MangaPagesList from "./components/MangaPagesList.tsx";
import Toolbar from "./components/Toolbar.tsx";
import UploadButton from "./components/Header/UploadButton.tsx";
import {PageContextProvider} from "./contexts/PageContext.tsx";

export default function App() {
  const [navbarOpen, {toggle: toggleNavbar}] = useDisclosure(true);
  const [asideOpen, {toggle: toggleAside}] = useDisclosure(true);

  return (
    <MantineProvider theme={theme}>
      <PageContextProvider>
        <AppShell
          header={{height: 60}}
          navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !navbarOpen}}}
          aside={{width: 300, breakpoint: 'sm', collapsed: {mobile: !asideOpen}}}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" px="md" style={{justifyContent: 'space-between'}}>
              <Group>
                <Burger opened={navbarOpen} onClick={toggleNavbar} size="sm"/>
              </Group>
              <Group justify={'center'} align={'center'} gap={"sm"}>
                <UploadButton/>
                <UploadButton/>
                <UploadButton/>
                <UploadButton/>
              </Group>
              <Group>
                <Burger opened={asideOpen} onClick={toggleAside} size="sm"/>
              </Group>
            </Group>
          </AppShell.Header>

          <Transition
            mounted={navbarOpen}
            transition="slide-right" // Choose your desired transition (slide-left, slide-right, fade, etc.)
            duration={200} // Adjust duration for speed
            timingFunction="ease" // Adjust timing function for animation style
          >
            {(styles) => (
              <AppShell.Navbar style={styles} p="md">
                <MangaPagesList/>
              </AppShell.Navbar>
            )}
          </Transition>


          <Transition
            mounted={asideOpen}
            transition="slide-left" // Choose your desired transition (slide-right, slide-left, fade, etc.)
            duration={200} // Adjust duration for speed
            timingFunction="ease" // Adjust timing function for animation style
          >
            {(styles) => (
              <AppShell.Aside style={styles} p="md">
                <Toolbar/>
              </AppShell.Aside>
            )}
          </Transition>

          <AppShell.Main>
            <Editor/>
          </AppShell.Main>
        </AppShell>
      </PageContextProvider>
    </MantineProvider>
  );
};
