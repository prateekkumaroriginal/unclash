import MainSidebar from "@/components/navigation/MainSidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <div className="invisible md:visible md:flex">
                <MainSidebar />
            </div>

            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;