import {
  Button,
  Box,
  Flex,
  Heading,
  Link,
  Spacer,
  useBreakpointValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  HamburgerIcon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  CloseIcon,
} from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { ToggleThemeContext } from "../context/ToggleTheme";
import {Route, Routes} from "react-router-dom"
import Home from "../pages/Home";
import TextGeneration from "../pages/TextGen";

export default function Navbar() {
  const { light, setLight } = useContext(ToggleThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("left");

  const isMobile = useBreakpointValue({ base: true, md: false, sm: false });

  function handleTheme() {
    setLight(!light);
  }
  return (<>
    <Box boxShadow={'rgba(0, 0, 0, 0.1) 0px 4px 12px;'}>
        
      {!isMobile ? (
        <Flex border={"1px"} p={3} gap={3}>
          <Box>
            <Heading size={"lg"} color={'#3d87ff'}>AskAI</Heading>
          </Box>
          <Spacer />
          <Box>
            <Link>Text Generation</Link>
          </Box>
          <Box>
            <Link>Image Generation</Link>
          </Box>
          <Box>
            <Link>Edit Images</Link>
          </Box>
          <Box>
            <Icon onClick={handleTheme}>
              {light ? <MoonIcon /> : <SunIcon />}
            </Icon>
          </Box>
        </Flex>
      ) : (
        <>
          <Flex justifyContent={"space-between"} border={"1px"} p={"4px"}>
            <Box>
              <Icon placement={placement} onClick={onOpen}>
                <HamburgerIcon />
              </Icon>
            </Box>
            <Box>
              <Heading size={"lg"} color={'#3d87ff'}>AskAI</Heading>
            </Box>
            <Box>
              <Icon onClick={handleTheme}>
                {light ? <MoonIcon /> : <SunIcon />}
              </Icon>
            </Box>
          </Flex>
          <Drawer
            placement={placement}
            onClose={onClose}
            isOpen={isOpen}
            size={"xs"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                <Flex>
                  <Box>
                    <Heading size={"md"}>Menu</Heading>
                  </Box>
                  <Spacer />
                  <Box>
                    <Icon onClick={onClose} as={CloseIcon} boxSize={3}></Icon>
                  </Box>
                </Flex>
              </DrawerHeader>

              <DrawerBody>
  <VStack align="start" spacing={4} mt={4}>
    <Box w="100%">
      <Link
        display="block"
        px={4}
        py={2}
        borderRadius="md"
        _hover={{ bg: "blue.100", textDecoration: "none" ,color:"black" }}
        _active={{ bg: "blue.200" }}
      >
        Text Generation
      </Link>
    </Box>

    <Box w="100%">
      <Link
        display="block"
        px={4}
        py={2}
        borderRadius="md"
        _hover={{ bg: "blue.100", textDecoration: "none" }}
        _active={{ bg: "blue.200" }}
      >
        Image Generation
      </Link>
    </Box>

    <Box w="100%">
      <Link
        display="block"
        px={4}
        py={2}
        borderRadius="md"
        _hover={{ bg: "blue.100", textDecoration: "none" }}
        _active={{ bg: "blue.200" }}
      >
        Edit Images
      </Link>
    </Box>
  </VStack>
</DrawerBody>

            </DrawerContent>
          </Drawer>
        </>
      )}
     
    </Box>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/textgen" element={<TextGeneration/>}/>
  </Routes>
  </>);
}
