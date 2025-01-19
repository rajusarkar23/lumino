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
            const res = await fetch("/api/blog", {
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
        <div className="ml-20 mt-20 border max-w-96 h-64 flex justify-center items-center">
            <div>
                {
                    loading ? (<>fetching...</>) : (
                        blogs.map((items, index) => (
                            <div key={index}>
                                <Link href={`blog/${items.slug}/${items.id}`} className="bg-orange-500 gap-3 mb-2 h-10">
                                    <h2>{items.title}</h2>
                                    <img src={items.thumbnailImage} alt="img" width={10} />
                                    <p>{items.id}</p>
                                </Link>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    )
}