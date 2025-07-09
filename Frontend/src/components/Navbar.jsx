import {
  Button,
  Box,
  Flex,
  Heading,
  Spacer,
  useBreakpointValue,
  useDisclosure,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  WrapItem,
  Avatar,
} from "@chakra-ui/icons";
import React, { lazy, Suspense } from "react";
import { useContext, useState, useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { ToggleThemeContext } from "../context/ToggleTheme";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import { AuthContext } from "../context/AuthContext";
import PrivateRoute from "../routes/privateRoute";
import EditImage from "../pages/EditImage";

const TextGen = React.lazy(() => import("../pages/TextGen"));
const ImageGen = React.lazy(() => import("../pages/ImageGen"));

export default function Navbar() {
  const { light, setLight } = useContext(ToggleThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("left");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const isMobile = useBreakpointValue({ base: true, md: false, sm: false });
  const navigate = useNavigate();

  function handleTheme() {
    setLight(!light);
  }

  const handleLogin = () => {
    window.location.href = "https://askai-50ai.onrender.com/auth/google";
  };

  const handleLogout = () => {
    fetch("https://askai-50ai.onrender.com/auth/logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("userInfo");
        navigate("/");
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <>
      <Box boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 12px;"}>
        {!isMobile ? (
          <Flex border={"1px"} p={3} gap={3}>
            <Box>
              <Heading size={"lg"} color={"#3d87ff"}>
                AskAI
              </Heading>
            </Box>
            <Spacer />
            {userInfo ? (
              <>
                {/* Left side nav links */}
                <Flex gap={6} alignItems="center">
                  <Box>
                    <Link to="/textgen">Text Generation</Link>
                  </Box>
                  <Box>
                    <Link to="/imggen">Image Generation</Link>
                  </Box>
                  <Box>
                    <Link to="/editgen">Edit Images</Link>
                  </Box>
                  <Box>
                    <Menu>
                      <MenuButton>
                        <WrapItem>
                          <Avatar
                            name={user?.name}
                            src={user?.photo}
                            size="sm"
                            cursor="pointer"
                          />
                        </WrapItem>
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </Flex>
              </>
            ) : (
              <></>
            )}

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
                <Heading size={"lg"} color={"#3d87ff"}>
                  AskAI
                </Heading>
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

    <DrawerBody onClick={onClose}>  {/* 👈 Added onClick here */}
      <VStack align="start" spacing={4} mt={4}>
        {!userInfo ? (
          <Flex justifyContent={"center"}>
            <Button
              leftIcon={<FaGoogle />}
              colorScheme="red"
              variant="outline"
              size="md"
              px={6}
              py={2}
              borderRadius="md"
              _hover={{ bg: "red.50" }}
              onClick={(e) => {
                e.stopPropagation(); // Prevents Drawer from closing before login fires
                handleLogin();
              }}
            >
              Login with Google
            </Button>
          </Flex>
        ) : (
          <>
            <Menu>
              <MenuButton>
                <WrapItem>
                  <Avatar
                    name={user?.name}
                    src={user?.photo}
                    size="sm"
                    cursor="pointer"
                  />
                </WrapItem>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation(); // prevent immediate close
                    handleLogout();
                    onClose(); // manually close after logout
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>

            {/* All Links below will close drawer on click */}
            <Box w="100%">
              <Link
                display="block"
                px={4}
                py={2}
                _hover={{ bg: "blue.100" }}
                to="/textgen"
              >
                Text Generation
              </Link>
            </Box>

            <Box w="100%">
              <Link
                display="block"
                px={4}
                py={2}
                _hover={{ bg: "blue.100" }}
                to="/imggen"
              >
                Image Generation
              </Link>
            </Box>

            <Box w="100%">
              <Link
                display="block"
                px={4}
                py={2}
                _hover={{ bg: "blue.100" }}
                to="/editgen"
              >
                Edit Images
              </Link>
            </Box>
          </>
        )}
      </VStack>
    </DrawerBody>
  </DrawerContent>
</Drawer>

          </>
        )}
      </Box>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/textgen"
          element={
            <PrivateRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <TextGen />
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route
          path="/imggen"
          element={
            <PrivateRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <ImageGen />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/editgen"
          element={
            <PrivateRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <EditImage />
              </Suspense>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
