import { Home } from "lucide-react";
import Link from "next/link";

export default function WriterHomeNavbar() {
    return (
        <div className="flex justify-between px-10 bg-green-500 h-12 items-center">
            <div>
                <Link href={"/writer/h"} className="text-2xl font-bold text-white flex">
                    <Home className="mt-1 mr-2" /> Writer home
                </Link>
            </div>
            <div>
                <Link href={"/writer/h/write-blog"} className="bg-violet-700 py-1 rounded-md hover:bg-violet-800 px-4 text-2xl font-bold text-white hover:text-white/90 transition-all">Write</Link>
            </div>
        </div>
    )
}