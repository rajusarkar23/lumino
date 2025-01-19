import { create } from "zustand"
import { persist } from "zustand/middleware"

interface writerAuthStoreTypes {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string,
    isSignedIn: boolean,
    isVerified: boolean,
    email: string,
    isSignupSuccess: boolean,
    writerSignup: (email: string, password: string) => Promise<void>
    writerOtpVerify: (otp: string) => Promise<void>
    writerSignin: (email: string, password: string) => Promise<void>
}

const writerAuthStore = create(persist<writerAuthStoreTypes>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: "",
    isSignedIn: false,
    isVerified: false,
    email: "",
    isSignupSuccess: false,
    writerSignup: async (email, password) => {
        set({ isLoading: true, isError: false, errorMessage: "", isSignupSuccess: false })
        try {
            const res = await fetch("/api/writer/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password, email })
            })
            const response = await res.json()
            console.log(response);

            if (response.success === true) {
                set({ isLoading: false, isError: false, errorMessage: "", isSignupSuccess: true, email: response.writerEmail })
            } else {
                set({ isLoading: false, isError: true, errorMessage: response.message, isSignupSuccess: false })
            }
        } catch (error) {
            console.log(error);
            set({ isLoading: false, isError: true, errorMessage: "Something went wrong, please try again.", isSignupSuccess: false, isVerified: false, email: "" })
        }
    },
    writerOtpVerify: async (otp) => {
        set({ isLoading: true, isError: false, errorMessage: "" })
        try {
            const res = await fetch("/api/writer/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp })
            })
            const response = await res.json()
            if (response.success === true) {
                set({ isLoading: false, isError: false, isVerified: true, errorMessage: "", email: response.writerEmail })
            } else {
                set({ isLoading: false, isError: true, errorMessage: response.message, isVerified: false })
            }
            console.log(response);
        } catch (error) {
            console.log(error);
            set({ isLoading: false, isError: true, errorMessage: "Something went wrong." })
        }
    },
    writerSignin: async (email, password) => {
        set({ isLoading: true, isError: false, errorMessage: "" })

        try {
            const res = await fetch("/api/writer/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const response = await res.json()
            console.log(response);
            
            if (response.success === true) {
                set({ isLoading: false, isError: false, errorMessage: "", email: response.writerEmail, isSignedIn: true })
            } else {
                set({ isLoading: false, isError: true, errorMessage: response.message, isSignedIn: false })
            }

        } catch (error) {
            console.log(error);
        }
    }
}), { name: "writer" }))

export default writerAuthStore