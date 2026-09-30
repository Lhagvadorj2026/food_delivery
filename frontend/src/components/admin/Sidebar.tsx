import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Админ Цэс</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Эхний цэс: Food Menu */}
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link href="/admin/menu" />}>
                                    <span>Food Menu</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Хоёрдахь цэс: Orders */}
                            <SidebarMenuItem>
                                <SidebarMenuButton render={<Link href="/admin/orders" />}>
                                    <span>orders</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}