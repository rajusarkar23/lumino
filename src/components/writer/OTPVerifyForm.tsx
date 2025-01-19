"use client"
import writerAuthStore from "@/store/writer/auth/authStore";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Spinner } from "@heroui/spinner";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function OTPVerifyForm() {
    const [otp, setOtp] = useState("");
    const { isLoading, isError, errorMessage, writerOtpVerify } = writerAuthStore()
    const router = useRouter()

    const verify = async () => {
        try {
            await writerOtpVerify(otp)
            if (writerAuthStore.getState().isVerified) {
                router.push("/writer/h")
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        // TODO: convert this to a form later
        <div className="flex flex-col gap-2 justify-center items-center mt-40 bg-violet-950/10 max-w-xl p-28 rounded-md shadow-lg">
            <InputOtp isRequired length={6} value={otp}
                validationBehavior="native"
                onValueChange={setOtp} />
            <div className="text-small text-black">
                Entered value: <span className="text-md font-medium">{otp}</span>
            </div>
            <div>
                {
                    isLoading ? (<Button isDisabled className="w-32"><Spinner /></Button>) : (<Button color="primary" type="submit" className="w-32 font-semibold" onPress={verify}>
                        Verify
                    </Button>)
                }
            </div>
            <div>
                {
                    isError ? (<p className="font-semibold text-red-500 underline flex"><X />{errorMessage}</p>) : (<></>)
                }
            </div>
        </div>
    )
}