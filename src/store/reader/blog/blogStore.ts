import { create } from "zustand"
import { persist } from "zustand/middleware"

interface blog {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnailImage: string;
    content: string;
    writerId: number;
}


interface blogStoreDataType {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string,
    isBlogsFetched: boolean,
    blogs: blog[],
    getBlog: () => Promise<void>
}

const blogStore = create(persist<blogStoreDataType>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: "",
    isBlogsFetched: false,
    blogs: [],
    getBlog: async () => {
        set({ isLoading: true, isBlogsFetched: false, isError: false, errorMessage: "", blogs: [] })
        try {
            const res = await fetch("/api/reader", {
                method: "GET"
            })
            const response = await res.json()
            console.log(response);
            if (response.success === true) {
                set({ isLoading: false, isBlogsFetched: true, isError: false, errorMessage: "", blogs: response.blogs })
            }
        } catch (error) {
            console.log(error);
            set({ isLoading: false, isError: true, errorMessage: "Something went wrong." })
        }
    }
}), { name: "client-blog-store" }))

export default blogStore