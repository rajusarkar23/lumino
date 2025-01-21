"use client"
import Link from "next/link";
import { useEffect, useState } from "react"

interface blog {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnailImage: string;
    content: string;
    writerId: number;
}


export default function FetchBlog() {
    const [loading, setLoading] = useState(false)
    const [blogs, setBlogs] = useState<blog[]>([])

    const fetchblog = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/reader", {
                method: "GET"
            })
            const response = await res.json()
            if (response.success === true) {
                setLoading(false)
                setBlogs(response.blogs)
                console.log(response);

            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchblog()
    }, [])

    return (
        <div className=" px-4 lg:px-64">
            <div className="sm:grid sm:grid-cols-2 gap-2 px-2 py-2">
                {
                    loading ? (<>fetching...</>) : (
                        blogs.map((items, index) => (
                            <div key={index} className="bg-[#E4E4E7] hover:bg-[#D4D4D8] hover:scale-95 transition-all mt-2 rounded-md px-2 py-2">
                                <Link href={`read/${items.slug}/${items.id}`} className="flex">
                                    <div className="px-1 items-center">
                                        <img src={items.thumbnailImage} alt="img" width={400} className="rounded" />
                                    </div>
                                    <div>
                                        <h2>{items.title}</h2>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    )
}