'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/animate-ui/components/radix/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/animate-ui/primitives/radix/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Spinner } from "@/components/ui/spinner"

import { Shield, Settings, MessageSquare, Menu, FileText, BarChart3, ChevronDown, Trash2, UserX, BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Settings2, 
  Home
} from "lucide-react";
const DATA = {
  navMain: [
    {
      title: 'Home',
      url: '',
      icon: Home
    },
    {
      title: 'statistics',
      url: '/statistics',
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: 'Active Bots',
          url: '/statistics/active-bots',
          icon: Bot,
        },
        {
          title: 'Deleted Messages',
          url: '/statistics/deleted-messages',
          icon: Trash2,
        },
        {
          title: 'Removed Users',
          url: '/statistics/removed-users',
          icon: UserX,
        },
      ],
    },
    {
      title: 'Manage Messages',
      url: '/manage-messages',
      icon: MessageSquare,
    },
    {
      title: 'Cofiguration',
      url: '/configuration',
      icon: Settings,
    },
    {
      title: 'Logs',
      url: '/logs',
      icon: FileText,
    },
  ],
};



export default function MainPageLayout({ children }: { children: React.ReactNode }) {

  return <RadixSidebarDemo children={children}/>
}

export const RadixSidebarDemo = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [activePage, setActivePage] = useState('');
  const [user, setUser] = useState<{ name: string; permission_id: string; } | null>(null);
  const [permission, setPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        
          if (userData.permission_id) {
            const permissionsRes = await fetch(`/api/permission?id=${userData.permission_id}`);
            if (permissionsRes.ok) {
              const permissionsData = await permissionsRes.json();
              setPermission(permissionsData.permission_name);
            }
          }
        } else {
          router.push('/login');
          return; 
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  console.log(user);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">Loading</div>
      </div>
    );
  }

  const userNameAvatarTrim = (username: string) => {
    return username[0];
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleNavigationInPages = (url: string) => {
    router.push(`/mainpage${url}`);
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          {/* Project Name and Logo */}
          <SidebarMenuItem>
            <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                      <Shield className="sizw-4 text-white" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        CrossGuard AI
                      </span>
                      <span className="truncate text-xs">
                        Group Protection
                      </span>
                    </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator />
        </SidebarHeader>

        <SidebarContent>
          {/* Nav Main */}
          <SidebarGroup>
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarMenu>
              {DATA.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} onClick={() => {if(!item.items) { handleNavigationInPages(item.url); } setActivePage(item.title)}}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        { item.items && <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild onClick={() => {handleNavigationInPages(subItem.url); setActivePage(subItem.title);}}>
                              <div>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* Nav Main */}

        </SidebarContent>
        <SidebarFooter>
          {/* Nav User */}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">{userNameAvatarTrim(user?.name as string)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {permission}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                          {userNameAvatarTrim(user?.name as string)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">
                          {permission}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Nav User */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    HomePage
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activePage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children} 
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};