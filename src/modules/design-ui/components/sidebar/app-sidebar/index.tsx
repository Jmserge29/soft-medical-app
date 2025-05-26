import { Calendar, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { SurgicalInstrumentRoutes } from '@/modules/surgical-instrument-maker/utils/routes/SurgicalInstrumentRoutes'

const items = [
  {
    title: 'Registrar instrumentos',
    url: SurgicalInstrumentRoutes.RegisterInstruments,
    icon: Settings,
  },
  {
    title: 'Mis cirugías',
    url: SurgicalInstrumentRoutes.MySurgeries,
    icon: Calendar,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="mt-10">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
