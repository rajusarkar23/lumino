"use client"

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { useState } from "react";

export default function SubscribeModal() {

  const [email, setEmail] = useState("")
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(email);

    try {
      const res = await fetch("/api/reader/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email})
      })

      const response = await res.json()

      console.log(response);
      
    } catch (error) {
      console.log(error);
      
    }

  }

  return (
    <>
      <Button onPress={onOpen} className="font-semibold">Subscribe</Button>
      <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-blue-600">Enter your email id.</ModalHeader>
              <ModalBody>
                <Form className="w-full" validationBehavior="native" onSubmit={onSubmit}>
                  <Input
                    isRequired
                    errorMessage="Please enter a valid email"
                    label="Email"
                    labelPlacement="inside"
                    name="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="space-x-4">
                    <Button type="submit" variant="flat" color="primary" className="font-bold">
                      Subscribe
                    </Button>
                  </div>

                </Form>
              </ModalBody>
              <ModalFooter>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}