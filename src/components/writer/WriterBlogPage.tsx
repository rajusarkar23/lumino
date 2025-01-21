"use client"
import { Button } from "@heroui/button";
import { useParams } from "next/navigation"

export default function WriterBlogPageComp() {

    const id = useParams().id
    console.log(id);

    const deleteBlog = async () => {
        try {
            const res = await fetch("/api/writer/blog/by-id", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            })

            const response = await res.json()
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-between px-8 mt-2">
            <div>
                WriterBlogPagecomp
            </div>

            <div>
                <Button color="warning" className="text-white font-semibold text-lg" onPress={deleteBlog}>Delete</Button>
            </div>
        </div>
    )
}