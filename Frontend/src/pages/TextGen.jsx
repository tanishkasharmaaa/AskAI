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
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import {
  HamburgerIcon,
  AddIcon,
  CloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import ModalForm from "../components/Modal";
import ChatResponse from "../components/ChatResponse";

export default function TextGeneration() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("left");
  const [chatroom, setChatRoom] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedChat, setSelectedChat] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false, sm: false });

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
      console.log(data.chat.answer);
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { prompt, response: data.chat.answer },
        ]);
        setPrompt("");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleChatRooms();
  }, [refreshKey]);
  return (
    <>
      {isMobile ? (
        <>
          <Flex mt={1} ml={1}>
            <Icon as={AddIcon} onClick={onOpen} />
          </Flex>
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
                      <Box w="100%">
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
                        <Button onClick={() => handleDeleteChatRoom(el._id)}>
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
              border="1px solid"
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
                      maxHeight="70vh"
                      border="1px solid #ddd"
                      p={4}
                      mb={4}
                      borderRadius="md"
                      bg="gray"
                    >
                      {messages.map((msg, idx) => (
                        <Box key={idx} mb={3}>
                          <Text fontWeight="bold">You:</Text>
                          <Text>{msg.prompt}</Text>

                          <Text fontWeight="bold" mt={2}>
                            AI:
                          </Text>
                          <ChatResponse content={{ response: msg.response }} />

                          <Divider my={2} />
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
                <Text>Select a chat room to start chatting</Text>
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

              <Flex justifyContent={"center"}>
                <Text>No Chats are there Add new chat</Text>
              </Flex>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
