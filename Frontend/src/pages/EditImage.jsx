import {
  Heading,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Image,
  Text,
  useClipboard,
  useToast,
  Textarea,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { lazy, Suspense, useRef, useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { IoCopyOutline } from "react-icons/io5";
import { GoPencil } from "react-icons/go";
import Download from "../components/Download";
import EditUploader from "../components/EditUploader";

export default function EditImage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const light = JSON.parse(localStorage.getItem("light"));
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [instruction, setInstruction] = useState("");
  const toast = useToast();
  const bottomRef = useRef(null);

  async function handleGenImages() {
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/upload-edit/edits`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();

      setRefreshKey((prev) => prev + 1);
      setMessages(data);

      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSendPrompt(file, promptText) {
    if (!promptText.trim() || !file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", promptText);

      const res = await fetch(
        "https://askai-50ai.onrender.com/upload-edit/editimage",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success!",
          description: "Image edited and uploaded.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setSelectedFile(null);
        setInstruction("");
      } else {
        toast({
          title: "Upload failed",
          description: data?.message || "Something went wrong.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        console.error("Server Error:", data.message);
      }
    } catch (err) {
      console.error("Error uploading image:", err.message);
      toast({
        title: "Error",
        description: "Failed to upload image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteChat(id) {
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/upload-edit/delete_edit/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
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
      // setEditId(id)
      const res = await fetch(
        `https://askai-50ai.onrender.com/upload-edit/edit/${id}`,
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

      const output = data.data;
      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id == id
              ? {
                  ...msg,
                  prompt: updatePrompt,
                  imageData: output.imageData,
                  description: output.description,
                }
              : msg
          )
        );
      }
      setEditId(null);
      setUpdatePrompt("");
      toast({
        title: "Updated!",
        description: "Prompt and image updated successfully.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update the prompt.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    handleGenImages();
  }, [refreshKey]);
  return (
    <Box pl={5} pr={5}>
      <Box>
        {/* Chat messages */}
        <Box
          flex="1"
          overflowY="auto"
          height={{
            base: "80vh",
            sm: "80vh",
            md: "80vh",
            lg: "80vh",
            xl: "80vh",
          }}
          border="none"
          p={4}
          mb={4}
          borderRadius="md"
        >
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <Box key={idx} mb={3}>
                <Flex justifyContent={"flex-end"} alignItems="center" gap={2}>
                  <Box
                    border={"solid"}
                    borderRadius={"md"}
                    p={2}
                    bg={light == true ? "#edf2fa" : "gray"}
                  >
                    {editId == msg._id ? (
                      <>
                        <Textarea
                          value={updatePrompt}
                          onChange={(e) => setUpdatePrompt(e.target.value)}
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
                      <Text>{msg.prompt}</Text>
                    )}
                  </Box>

                  <Button
                    bg={light ? "blue.100" : "blue.800"}
                    color={light ? "black" : "white"}
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(msg.prompt);
                      toast({
                        title: "Copied!",
                        description: "Prompt copied to clipboard.",
                        status: "success",
                        duration: 1500,
                        isClosable: true,
                      });
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
                    onClick={() => handleDeleteChat(msg._id)}
                  >
                    <Icon as={DeleteIcon} />
                  </Button>
                  <Button
                    bg={"none"}
                    pt={1}
                    pb={1}
                    p={1}
                    onClick={() => {
                      setEditId(msg._id);
                      setUpdatePrompt(msg.prompt);
                    }}
                  >
                    <Icon as={GoPencil} />
                  </Button>
                </Flex>

                <br />
                <Flex justifyContent={"flex-start"}>
                  <Box boxSize="md" objectFit="cover">
                    <Flex>
                      <Box>
                        <Image src={msg.imageData} />
                      </Box>
                      <Box>
                        <Download link={msg.imageData} />
                      </Box>
                    </Flex>

                    <Text>{msg.description}</Text>
                  </Box>
                </Flex>
                <br />
              </Box>
            ))
          ) : (
            <Flex minH="80vh" justifyContent="center" alignItems="center">
              <Box>
                <Heading fontSize={"5xl"}>Edit Image</Heading>
              </Box>
            </Flex>
          )}
        </Box>
      </Box>

      {/* Input prompt */}

      <EditUploader handleSendPrompt={handleSendPrompt} loading={loading} />
    </Box>
  );
}
