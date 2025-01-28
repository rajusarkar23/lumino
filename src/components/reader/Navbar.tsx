import { BrainCircuit, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import SubscribeModal from "./SubscribeModal";

export default function Navbar() {
    return (
        <div className="flex justify-between px-6 bg-[#481878] shadow-md h-16 items-center">
            <div>
                <Link href={"/"} className="text-2xl font-bold text-white flex">
                    <span>Lumino</span> <BrainCircuit className="mt-2 ml-1" />
                </Link>
            </div>
            <div className="text-white space-x-2 sm:flex hidden">
                <Link href={"/"}>All</Link>
                <EllipsisVertical />
                <Link href={"/fitness"}>Fitness</Link>
                <EllipsisVertical />
                <Link href={"/mental-health"}>Mental Health</Link>
                <EllipsisVertical />
                <Link href={"/finance"}>Finance</Link>
            </div>
            <div>
                <SubscribeModal />
            </div>
        </div>
    )
}