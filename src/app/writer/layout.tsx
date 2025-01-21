import WriterHomeNavbar from "@/components/writer/WriterHomeNavbar";
import "../../app/globals.css";
import { HeroUIProvider } from "@heroui/system";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <HeroUIProvider>
                <WriterHomeNavbar />
                {children}
            </HeroUIProvider>
        </div>


    );
}
