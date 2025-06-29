
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (


        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger  />
            {/* write tailwind css to make the containt in this section should center of the page and ui and ux friendly */}
            <main className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 w-full min-h-screen  ">
            
                    
                    {children}
            
            </main>
        </SidebarProvider>

    );
}