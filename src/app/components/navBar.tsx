'use client';

import {
	NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {cn} from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import {SearchBar} from './searchBar';

export const NavBar = () => (
	<div className='w-full flex justify-between px-3 py-3' >
		<Link href='/'>
			<h1 className='text-2xl'>LOOK, LEARN, REMEMBER</h1>
		</Link>
		<SearchBar />
		<NavigationMenu>
			<NavigationMenuList className='flex'>
				<NavigationMenuItem>
					Placeholder
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Login</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid gap-3 p-4 md:w-[120px] lg:w-[160px]'>
							<ListItem href='/login' title='로그인' />
							<ListItem href='/signup' title='회원가입' />
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	</div>
);

const ListItem = React.forwardRef<
React.ElementRef<'a'>,
React.ComponentPropsWithoutRef<'a'>
>(({className, title, children, ...props}, ref) => (
	<li>
		<NavigationMenuLink asChild>
			<a
				ref={ref}
				className={cn(
					'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
					className,
				)}
				{...props}
			>
				<div className='text-sm font-medium leading-none'>{title}</div>
				<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
					{children}
				</p>
			</a>
		</NavigationMenuLink>
	</li>
));
ListItem.displayName = 'ListItem';
