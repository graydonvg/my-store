'use client';

import { useState } from 'react';
import { NavOptions, adminNavOptions, cn, navOptions } from '@/lib/utils';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from './AccountMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TemporaryDrawer from './TemporaryDrawer';
import { Divider, Tooltip } from '@mui/material';
import PrimaryButton from './Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type NavOptionProps = {
  option: NavOptions;
  isDrawerOpen: boolean;
};

function NavOption({ option, isDrawerOpen }: NavOptionProps) {
  return (
    <li
      className={cn('list-none', {
        'h-12 px-4': isDrawerOpen,
      })}>
      <div className="md:p-0 h-full">
        <Link
          href={option.path}
          aria-label={option.label}
          className="h-full focus-visible:ring-offset-8 flex items-center justify-between no-underline text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-gray-200 dark:focus-visible:ring-gray-600 rounded">
          {option.label}
          <ArrowForwardIosIcon
            className={cn('text-gray-500', {
              hidden: !isDrawerOpen,
            })}
          />
        </Link>
        <Divider className={cn({ hidden: !isDrawerOpen })} />
      </div>
    </li>
  );
}

function NavOptions({ isDrawerOpen = false }) {
  return (
    <div
      id="nav-items"
      className={cn('items-center justify-between w-screen md:flex md:w-auto ', {
        hidden: !isDrawerOpen,
      })}>
      <ul
        role="navigation"
        className="flex flex-col pl-0 mt-0 mb-0 md:p-0 md:flex-row md:space-x-8">
        {user.role === 'admin'
          ? adminNavOptions
              .filter((option) => (!isDrawerOpen ? !option.temporaryDrawerOnly : option))
              .map((option) => (
                <NavOption
                  key={option.id}
                  option={option}
                  isDrawerOpen={isDrawerOpen}
                />
              ))
          : navOptions
              .filter((option) => (!isDrawerOpen ? !option.temporaryDrawerOnly : option))
              .map((option) => (
                <NavOption
                  key={option.id}
                  option={option}
                  isDrawerOpen={isDrawerOpen}
                />
              ))}
      </ul>
    </div>
  );
}

const isAdminView = false;
const isAuthUser = true;
const user = {
  // role: 'admin',
  role: 'customer',
};

function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <nav className="bg-white sticky w-full z-200 top-0 left-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex justify-between items-center mx-auto py-4 px-6 h-12">
          <Link
            href={'/'}
            className="text-gray-900 order-2 focus-visible:ring-offset-8 md:order-1 self-center no-underline text-2xl font-semibold whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded">
            MyStore
          </Link>
          <MenuIcon
            tabIndex={0}
            onClick={() => setIsOpen((prev) => !prev)}
            className="order-1 p-2 focus:outline-none text-gray-500 md:hidden hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded cursor-pointer"
          />
          <div className="md:order-2 md:block hidden">
            <NavOptions />
          </div>
          <div className="order-3 flex items-center justify-center gap-4">
            {isAuthUser ? (
              <>
                {user?.role !== 'admin' ? (
                  <Tooltip title="Shopping cart">
                    <ShoppingCartIcon
                      tabIndex={0}
                      role="button"
                      aria-label="Shopping cart"
                      className="text-gray-900 cursor-pointer focus-visible:ring-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded h-6 w-6 p-2"
                    />
                  </Tooltip>
                ) : null}
                <AccountMenu
                  user={user}
                  isAdminView={isAdminView}
                />
              </>
            ) : (
              <PrimaryButton>Sign In</PrimaryButton>
            )}
          </div>
        </div>
      </nav>
      <TemporaryDrawer
        drawerAnchor={'left'}
        isOpen={isOpen}
        content={<NavOptions isDrawerOpen={true} />}
      />
    </>
  );
}

export default Navbar;
