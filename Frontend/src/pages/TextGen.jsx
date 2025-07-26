import {
  Heading,
  Box,
  Flex,
  Input,
  Button,
  useDisclosure,
  useBreakpointValue,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Spacer,
  VStack,
  Link,
  Text,
  Divider,
  Toast,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { IoCopyOutline } from "react-icons/io5";
import {
  HamburgerIcon,
  AddIcon,
  CloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import React, { Suspense, useContext, useEffect, useState } from "react";
import ModalForm from "../components/Modal";
import { GoPencil } from "react-icons/go";
const ChatResponse = React.lazy(() => import("../components/ChatResponse"));

export default function TextGeneration() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("left");
  const [chatroom, setChatRoom] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedChat, setSelectedChat] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const light = JSON.parse(localStorage.getItem("theme"));
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false, sm: false });

  async function allChats() {
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/chats/${selectedChat._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();

      setMessages(data.chats);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleChatRooms() {
    try {
      const res = await fetch("https://askai-50ai.onrender.com/ai/chat", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRefreshKey((prev) => prev + 1);
      setChatRoom(sorted);

      return true;
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
      return false;
    }
  }

  async function handleDeleteChatRoom(id) {
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/deleteChatRoom/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteChat(id) {
    console.log(selectedChat._id, id);
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/chat/${selectedChat._id}/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSendPrompt() {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/chat/${selectedChat._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            prompt,
          }),
        }
      );

      const data = await res.json();
      const output = data;
      console.log(output)
      if (res.ok) {
        setMessages((prev) => [...prev, { prompt, response: output }]);
        setPrompt("");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateChat(id) {
  try {
    const res = await fetch(
      `https://askai-50ai.onrender.com/ai/updateChat/${selectedChat._id}/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: updatePrompt }),
      }
    );

    const data = await res.json();
    const updatedChat = data.updatedChat;

    if (res.ok) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id
            ? {
                ...msg,
                prompt: updatedChat.question,
                answer: updatedChat.answer,
              }
            : msg
        )
      );

      toast({
        title: "Updated!",
        description: "Prompt and response updated successfully.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      setEditId(null);
      setUpdatePrompt("");
    } else {
      throw new Error(data.message || "Server error");
    }
  } catch (error) {
    console.error("Update error:", error);
    toast({
      title: "Error",
      description: "Failed to update the prompt.",
      status: "error",
      duration: 1500,
      isClosable: true,
    });
  }
}

  
  async function handleUpdateChat(id) {
  try {
    const res = await fetch(
      `https://askai-50ai.onrender.com/ai/updateChat/${selectedChat._id}/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt: updatePrompt,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update");
    }

    const updated = data.updatedChat;

    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === id
          ? { ...msg, prompt: updated.question, answer: updated.answer }
          : msg
      )
    );

    setEditId(null);
    setUpdatePrompt("");

    toast({
      title: "Updated!",
      description: "Chat prompt and response updated.",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    toast({
      title: "Error",
      description: error.message || "Update failed",
      status: "error",
      duration: 1500,
      isClosable: true,
    });
  }
}


  useEffect(() => {
    if (selectedChat?._id) {
      allChats();
    }
    handleChatRooms();
  }, [selectedChat, refreshKey]);

  return (
    <Box pl={5} pr={5}>
      {isMobile ? (
        <>
          <Flex mt={1} ml={1} pt={1} pb={1}>
            <Icon as={AddIcon} onClick={onOpen} />
          </Flex>
          <Box
            border="none"
            width="100%"
            p={1}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            {selectedChat ? (
              <>
                <Box>
                  <Heading size="md" mb={1}>
                    {selectedChat.chatTitle}
                  </Heading>

                  {/* Chat messages */}
                  <Box
                    flex="1"
                    overflowY="auto"
                    height={{
                      base: "70vh",
                      sm: "70vh",
                      md: "70vh",
                      lg: "70vh",
                      xl: "70vh",
                    }}
                    border="1px solid #ddd"
                    p={4}
                    mb={4}
                    borderRadius="md"
                  >
                    {messages.map((msg, idx) => (
                      <Box key={idx} mb={3}>
                        <Flex justifyContent={"flex-end"}>
                          <Box
                            border={"solid"}
                            borderRadius={"md"}
                            p={2}
                            bg={light == true ? "gray.200" : "gray.600"}
                          >
                            {editId == msg._id ? (
                              <>
                                <Textarea
                                  value={updatePrompt}
                                  onChange={(e) =>
                                    setUpdatePrompt(e.target.value)
                                  }
                                  autoFocus
                                />
                                <Button
                                  p={"none"}
                                  bg={"none"}
                                  value={updatePrompt}
                                  onClick={() => handleUpdateChat(msg._id)}
                                >
                                  ✓
                                </Button>
                                <Button
                                  p={"none"}
                                  bg={"none"}
                                  onClick={() => setEditId(null)}
                                >
                                  ✕
                                </Button>
                              </>
                            ) : (
                              <Text>{msg.question}</Text>
                            )}
                          </Box>
                           <Button
                                bg="transparent"
                                size="sm"
                                color={light ? "black" : "white"}
                                onClick={async () => {
                                  if (!msg.question) {
                                    toast({
                                      title: "Nothing to copy",
                                      description:
                                        "Prompt is empty or unavailable.",
                                      status: "warning",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                    return;
                                  }

                                  try {
                                    await navigator.clipboard.writeText(
                                      msg.question
                                    );
                                    toast({
                                      title: "Copied!",
                                      description:
                                        "Prompt copied to clipboard.",
                                      status: "success",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Clipboard copy failed:",
                                      err
                                    );
                                    toast({
                                      title: "Failed!",
                                      description:
                                        "Could not copy to clipboard.",
                                      status: "error",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  }
                                }}
                              >
                                <Icon
                                  as={IoCopyOutline}
                                  color={light ? "black" : "white"}
                                />
                              </Button>
                          <Button
                            bg={"none"}
                            pt={1}
                            pb={1}
                            p={1}
                            onClick={() => {
                              setEditId(msg._id);
                              setUpdatePrompt(msg.question);
                            }}
                          >
                            <Icon as={GoPencil} />
                          </Button>
                          <Button
                            pt={1}
                            pb={1}
                            p={1}
                            onClick={() => handleDeleteChat(msg.chatId)}
                          >
                            <Icon as={DeleteIcon} />
                          </Button>
                        </Flex>
                        <br />
                        <Flex justifyContent={"flex-start"}>
                          <Box
                            border={"solid"}
                            borderRadius={"md"}
                            p={2}
                            bg={light == true ? "blue.200" : "blue.600"}
                          >
                            <Suspense fallback={<div>Loading...</div>}>
                              <ChatResponse content={msg.answer} />
                            </Suspense>
                          </Box>
                        </Flex>
                        <Flex>
                          <Button
                            bg="transparent"
                            size="sm"
                            color={light ? "black" : "white"}
                            onClick={async () => {
                              if (!msg.answer) {
                                toast({
                                  title: "Nothing to copy",
                                  description:
                                    "Prompt is empty or unavailable.",
                                  status: "warning",
                                  duration: 1500,
                                  isClosable: true,
                                });
                                return;
                              }

                              try {
                                await navigator.clipboard.writeText(msg.answer);
                                toast({
                                  title: "Copied!",
                                  description: "Prompt copied to clipboard.",
                                  status: "success",
                                  duration: 1500,
                                  isClosable: true,
                                });
                              } catch (err) {
                                console.error("Clipboard copy failed:", err);
                                toast({
                                  title: "Failed!",
                                  description: "Could not copy to clipboard.",
                                  status: "error",
                                  duration: 1500,
                                  isClosable: true,
                                });
                              }
                            }}
                          >
                            <Icon
                              as={IoCopyOutline}
                              color={light ? "black" : "white"}
                            />
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Input prompt */}
                <Box display="flex" gap={2}>
                  <Input
                    placeholder="Ask something..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleSendPrompt}
                    isLoading={loading}
                  >
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Flex minH="80vh" justifyContent="center" alignItems="center">
                <Box textAlign={"center"}>
                  <Heading fontSize={"5xl"}>
                    Select a ChatRoom or create one
                  </Heading>
                </Box>
              </Flex>
            )}
          </Box>
        </>
      ) : (
        <>
          <Flex>
            {/* Left Sidebar */}{" "}
            <Box border="1px solid" height="90vh" width="30%" p={1}>
              {/* Sidebar or Nav */}
              <ModalForm func={handleChatRooms} />
              <VStack align="start" spacing={4} mt={4}>
                {chatroom.length == 0 ? (
                  <>
                    <Flex>
                      <Text>No Chatroom is there</Text>
                    </Flex>
                  </>
                ) : (
                  chatroom.map((el) => (
                    <Flex
                      w="100%"
                      key={el._id}
                      align="center"
                      justify={"space-between"}
                      overflow={"hidden"}
                    >
                      <Box w="100%" borderRadius={"none"} bg={"blue.400"}>
                        <Link
                          display="block"
                          px={4}
                          py={2}
                          borderRadius="md"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          _hover={{
                            bg: "blue.100",
                            textDecoration: "none",
                            color: "black",
                          }}
                          _active={{ bg: "blue.200" }}
                          onClick={() => setSelectedChat(el)}
                        >
                          {el.chatTitle}
                        </Link>{" "}
                      </Box>
                      <Box>
                        <Button
                          onClick={() => handleDeleteChatRoom(el._id)}
                          bg={"none"}
                        >
                          <Icon as={DeleteIcon} />
                        </Button>
                      </Box>
                    </Flex>
                  ))
                )}
              </VStack>

              {/* Right Chat Window */}
            </Box>
            <Box
              border="none"
              width="75%"
              p={4}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              {selectedChat ? (
                <>
                  <Box>
                    <Heading size="md" mb={4}>
                      {selectedChat.chatTitle}
                    </Heading>

                    {/* Chat messages */}
                    <Box
                      flex="1"
                      overflowY="auto"
                      maxHeight={["70vh", "75vh", "85vh"]}
                      border="none"
                      p={1}
                      mb={4}
                      borderRadius="md"
                    >
                      {messages.map((msg, idx) => (
                        <Box key={idx} mb={3}>
                          <Flex justifyContent={"flex-end"}>
                            <Box
                              border={"solid"}
                              borderRadius={"md"}
                              p={2}
                              bg={light == true ? "gray.200" : "gray.600"}
                            >
                              {editId == msg.chatId ? (
                                <>
                                  <Textarea
                                    value={updatePrompt}
                                    onChange={(e) =>
                                      setUpdatePrompt(e.target.value)
                                    }
                                    autoFocus
                                  />
                                  <Button
                                    p={"none"}
                                    bg={"none"}
                                    value={updatePrompt}
                                    onClick={() => handleUpdateChat(msg._id)}
                                  >
                                    ✓
                                  </Button>
                                  <Button
                                    p={"none"}
                                    bg={"none"}
                                    onClick={() => setEditId(null)}
                                  >
                                    ✕
                                  </Button>
                                </>
                              ) : (
                                <Text>{msg.question}</Text>
                              )}
                            </Box>
                             <Button
                                bg="transparent"
                                size="sm"
                                color={light ? "black" : "white"}
                                onClick={async () => {
                                  if (!msg.question) {
                                    toast({
                                      title: "Nothing to copy",
                                      description:
                                        "Prompt is empty or unavailable.",
                                      status: "warning",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                    return;
                                  }

                                  try {
                                    await navigator.clipboard.writeText(
                                      msg.question
                                    );
                                    toast({
                                      title: "Copied!",
                                      description:
                                        "Prompt copied to clipboard.",
                                      status: "success",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Clipboard copy failed:",
                                      err
                                    );
                                    toast({
                                      title: "Failed!",
                                      description:
                                        "Could not copy to clipboard.",
                                      status: "error",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  }
                                }}
                              >
                                <Icon
                                  as={IoCopyOutline}
                                  color={light ? "black" : "white"}
                                />
                              </Button>
                            <Button
                              bg={"none"}
                              pt={1}
                              pb={1}
                              p={1}
                              onClick={() => {
                                setEditId(msg.chatId);
                                setUpdatePrompt(msg.question);
                              }}
                            >
                              <Icon as={GoPencil} />
                            </Button>
                            <Button
                              bg={"none"}
                              pt={1}
                              pb={1}
                              p={1}
                              onClick={() => handleDeleteChat(msg.chatId)}
                            >
                              <Icon
                                as={DeleteIcon}
                                color={light == true ? "black" : "white"}
                              />
                            </Button>
                          </Flex>

                          <br />
                          <Flex justifyContent={"flex-start"}>
                            <Box
                              border={"solid"}
                              borderRadius={"md"}
                              p={2}
                              bg={light == true ? "blue.200" : "blue.600"}
                            >
                              <Suspense fallback={<div>Loading...</div>}>
                                <ChatResponse content={msg.answer} />
                              </Suspense>
                            </Box>
                            <Flex>
                              <Button
                                bg="transparent"
                                size="sm"
                                color={light ? "black" : "white"}
                                onClick={async () => {
                                  if (!msg.answer) {
                                    toast({
                                      title: "Nothing to copy",
                                      description:
                                        "Prompt is empty or unavailable.",
                                      status: "warning",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                    return;
                                  }

                                  try {
                                    await navigator.clipboard.writeText(
                                      msg.answer
                                    );
                                    toast({
                                      title: "Copied!",
                                      description:
                                        "Prompt copied to clipboard.",
                                      status: "success",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Clipboard copy failed:",
                                      err
                                    );
                                    toast({
                                      title: "Failed!",
                                      description:
                                        "Could not copy to clipboard.",
                                      status: "error",
                                      duration: 1500,
                                      isClosable: true,
                                    });
                                  }
                                }}
                              >
                                <Icon
                                  as={IoCopyOutline}
                                  color={light ? "black" : "white"}
                                />
                              </Button>
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Input prompt */}
                  <Box display="flex" gap={2}>
                    <Input
                      placeholder="Ask something..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                      colorScheme="blue"
                      onClick={handleSendPrompt}
                      isLoading={loading}
                    >
                      Send
                    </Button>
                  </Box>
                </>
              ) : (
                <Flex minH="80vh" justifyContent="center" alignItems="center">
                  <Box textAlign={"center"}>
                    <Heading fontSize={"5xl"}>
                      Select a ChatRoom or create one
                    </Heading>
                  </Box>
                </Flex>
              )}
            </Box>
          </Flex>
        </>
      )}
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
              <ModalForm />
              <Spacer />
              <Box>
                <Icon onClick={onClose} as={CloseIcon} boxSize={3}></Icon>
              </Box>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <VStack align="start" spacing={4} mt={4}>
              {chatroom.map((el) => (
                <Flex w="100%" key={el._id}>
                  <Box w="100%">
                    <Link
                      display="block"
                      px={4}
                      py={2}
                      borderRadius="md"
                      _hover={{
                        bg: "blue.100",
                        textDecoration: "none",
                        color: "black",
                      }}
                      _active={{ bg: "blue.200" }}
                      onClick={() => {
                        setSelectedChat(el);
                        onClose();
                      }}
                    >
                      {el.chatTitle}
                    </Link>{" "}
                  </Box>
                  <Box>
                    <Button onClick={() => handleDeleteChatRoom(el._id)}>
                      <Icon as={DeleteIcon} />
                    </Button>
                  </Box>
                </Flex>
              ))}

              {chatroom.length == 0 ? (
                <Flex justifyContent={"center"}>
                  <Text>No Chats are there Add new chat</Text>
                </Flex>
              ) : null}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
