import {
  useDisclosure,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  ModalOverlay,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

export default function ModalForm({ func = () => {} }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function handleInput(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }
  async function handleSave() {
    setLoading(true);

    try {
      const res = await fetch(
        "https://askai-50ai.onrender.com/ai/createChatRoom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // important to send cookies
          body: JSON.stringify({ title }),
        }
      );

      const data = await res.json();
     
if (res.ok) {
  await func(); // 🛠️ Add `await` to wait for updated chat list
  onClose();
  toast({
    title: "Success!",
    description: "Chat room created successfully.",
    status: "success",
    duration: 3000,
    isClosable: true,
    position: "top",
  });
  setTitle("");
}



     
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box>
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          w="100%"
          onClick={onOpen}
        >
          New Chat
        </Button>
      </Box>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chat title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Chat title"
                name="title"
                value={title}
                onChange={(e) => handleInput(e)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isLoading={loading}
              loadingText="Saving..."
            >
              Save
            </Button>

            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
