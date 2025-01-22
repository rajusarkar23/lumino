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
            const res = await fetch("/api/writer/blog", {
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
        <div className=" px-16">
            <div>
                {
                    loading ? (<>fetching...</>) : (
                        blogs.map((items, index) => (
                            <div key={index} className="bg-[#E4E4E7] hover:bg-[#D4D4D8] hover:scale-105 transition-all mt-2 rounded-md px-2">
                                <Link href={`${items.slug}/${items.id}`} className="">
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