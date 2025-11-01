'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogOut, BarChart3, Home, Settings } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavBarProps {
    userData: Omit<
        User,
        'hasCompletedOnboarding' | 'createdAt' | 'updatedAt'
    > | null;
    onLogout: () => void;
    devOverride?: boolean;
    onToggleDevOverride?: () => void;
}

export function NavBar({
    userData,
    onLogout,
    devOverride,
    onToggleDevOverride,
}: NavBarProps) {
    const pathname = usePathname();

    return (
        <nav className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto px-4'>
                <div className='flex h-16 items-center justify-between'>
                    {/* Logo/Brand */}
                    <div className='flex items-center gap-6'>
                        <Link href='/' className='flex items-center gap-2'>
                            <span className='text-xl font-bold'>NNN</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className='hidden md:flex items-center gap-1'>
                            <Button
                                variant={
                                    pathname === '/' ? 'secondary' : 'ghost'
                                }
                                size='sm'
                                className='gap-2'
                                asChild
                            >
                                <Link href='/'>
                                    <Home className='h-4 w-4' />
                                    Dashboard
                                </Link>
                            </Button>
                            <Button
                                variant={
                                    pathname === '/stats'
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                size='sm'
                                className='gap-2'
                                asChild
                            >
                                <Link href='/stats'>
                                    <BarChart3 className='h-4 w-4' />
                                    Stats
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right side - Theme toggle and user menu */}
                    <div className='flex items-center gap-2'>
                        {devOverride && onToggleDevOverride && (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={onToggleDevOverride}
                                className='text-xs hidden md:flex bg-transparent'
                            >
                                Dev Override: ON
                            </Button>
                        )}

                        <ThemeToggle />

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='ghost'
                                    className='relative h-10 w-10 rounded-full'
                                >
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage
                                            src={userData?.image ?? undefined}
                                            alt={
                                                userData?.name || 'User Avatar'
                                            }
                                        />
                                        <AvatarFallback>
                                            {userData?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className='w-56'
                                align='end'
                                forceMount
                            >
                                <div className='flex items-center gap-2 p-2'>
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage
                                            src={userData?.image ?? undefined}
                                            alt={
                                                userData?.name || 'User Avatar'
                                            }
                                        />
                                        <AvatarFallback>
                                            {userData?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <p className='text-sm font-medium'>
                                            {userData?.name || 'User'}
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {userData?.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href='/settings'>
                                        <Settings className='mr-2 h-4 w-4' />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <div className='md:hidden'>
                                    <DropdownMenuItem asChild>
                                        <Link href='/'>
                                            <Home className='mr-2 h-4 w-4' />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href='/stats'>
                                            <BarChart3 className='mr-2 h-4 w-4' />
                                            Stats
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </div>
                                {devOverride && onToggleDevOverride && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={onToggleDevOverride}
                                            className='md:hidden'
                                        >
                                            Dev Override: ON
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem
                                    onClick={onLogout}
                                    className='text-red-500 focus:text-red-500'
                                >
                                    <LogOut className='mr-2 h-4 w-4' />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
