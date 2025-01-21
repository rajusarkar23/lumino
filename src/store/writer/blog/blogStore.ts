import { create } from "zustand"
import { persist } from "zustand/middleware"

interface blogStoreDataType {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string,
    isGetBlogById: boolean,
    blogId: any,
    title: string,
    writerId: any,
    thumbnailImage: string,
    content: string,
    category: string,
    writeBlog: (title: string, slug: string, thumbnailImage: string, content: string, category: string) => Promise<void>,
    getBlogById: (id: string) => Promise<void>
}

const blogStore = create(persist<blogStoreDataType>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: "",
    isGetBlogById: false,
    blogId: undefined,
    title: "",
    writerId: undefined,
    thumbnailImage: "",
    content: "",
    category: "",
    writeBlog: async (title, slug, thumbnailImage, content, category) => {
        set({ isLoading: true, isError: false })
        try {
            const res = await fetch("/api/writer/blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, slug, thumbnailImage, category }),
            });
            const response = await res.json()
            if (response.success === true) {
                set({ isLoading: false, isError: false, errorMessage: "" })
            }
        } catch (error) {
            console.log(error);
        }
    },
    getBlogById: async (id) => {
        set({ isLoading: true, isError: false, errorMessage: "" })
        try {
            const res = await fetch("/api/blog/by-id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            })
            const response = await res.json()
            if (response.success === true) {
                const blog = response.fetchBlogById
                set({isError: false, isLoading: false, isGetBlogById: true, title: blog.title, content: blog.content, thumbnailImage: blog.thumbnailImage, blogId: blog.id, category: blog.category})
            }
            console.log(response);
            set({isLoading: false})
        } catch (error) {
            console.log(error);
            set({isLoading: false, isError: true, errorMessage: "Something went wrong, please try again."})
        }
    }
}), { name: "blog-store" }))

export default blogStore