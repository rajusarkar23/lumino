"use client"

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";

export default function SubscribeModal(){


    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
      <>
        <Button onPress={onOpen} className="font-semibold">Subscribe</Button>
        <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Enter your email id.</ModalHeader>
                <ModalBody>
                  <Input type="email" color="primary" label="Enter your email" labelPlacement="inside"/>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose} className="font-semibold">
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
}