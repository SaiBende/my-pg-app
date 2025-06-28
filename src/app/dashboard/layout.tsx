import DashboardNavbar from "@/components/DashboardNavbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <DashboardNavbar/>
        {children}
        </section>
}