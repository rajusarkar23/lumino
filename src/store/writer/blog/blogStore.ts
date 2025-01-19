import { create } from "zustand"
import { persist } from "zustand/middleware"

interface blogStoreDataType {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string,
    blogs: []
    writeBlog: (title: string, slug: string, thumbnailImage: string, content: string) => Promise<void>
}

const blogStore = create(persist<blogStoreDataType>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: "",
    blogs: [],
    writeBlog: async (title, slug, thumbnailImage, content) => {
        set({ isLoading: true, isError: false })
        try {
            const res = await fetch("/api/writer/blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, slug, thumbnailImage }),
            });
            const response = await res.json()
            if (response.success === true) {
                set({ isLoading: false, isError: false, errorMessage: "" })
            }

        } catch (error) {
            console.log(error);
        }
    }
}), { name: "blog-store" }))

export default blogStore