"use client"
import blogStore from "@/store/writer/blog/blogStore";
import { useParams } from "next/navigation"
import { useEffect } from "react";

export default function FetchBlogById() {
    const id = useParams().id
    const toNum = Number(id)
    const { getBlogById, title, blogId } = blogStore()
    const getById = async () => {
        console.log(typeof toNum);

        if (typeof id === "string" && blogStore.getState().blogId !== toNum) {
            await getBlogById(id)
        }
    }
    useEffect(() => {
        getById()
    }, [])

    return (
        <div>
            {
                blogStore.getState().isLoading ? (<p>Loading...</p>) : (<div>
                    {title}
                    {blogId}
                </div>)
            }

        </div>
    )
}