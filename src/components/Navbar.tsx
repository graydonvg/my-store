'use client';

import { FC, useState } from 'react';
import { adminNavOptions, cn, navOptions } from '@/lib/utils';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import UserButton from './UserButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TemporaryDrawer from './TemporaryDrawer';
import { Divider, Tooltip } from '@mui/material';
import PrimaryButton from './Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type NavbarProps = {};

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
        {isAdminView
          ? adminNavOptions
              .filter((option, index) => (!isDrawerOpen ? index < 2 : option))
              .map((option) => (
                <>
                  <li
                    key={option.id}
                    className="list-none py-2 px-4 md:p-0">
                    <Link
                      href={option.path}
                      aria-label={option.label}
                      className="no-underline text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded focus-visible:ring-offset-4">
                      <div className="w-full flex justify-between items-center">
                        {option.label}
                        <ArrowForwardIosIcon
                          className={cn('text-gray-500', {
                            hidden: !isDrawerOpen,
                          })}
                        />
                      </div>
                    </Link>
                  </li>
                  <Divider className={cn({ hidden: !isDrawerOpen })} />
                </>
              ))
          : navOptions
              .filter((option, index) => (!isDrawerOpen ? index < 5 : option))
              .map((option) => (
                <>
                  <li
                    key={option.id}
                    className="list-none py-2 px-4 md:p-0">
                    <Link
                      href={option.path}
                      aria-label={option.label}
                      className="no-underline text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded focus-visible:ring-offset-4">
                      <div className="w-full flex justify-between items-center">
                        {option.label}
                        <ArrowForwardIosIcon
                          className={cn('text-gray-500', {
                            hidden: !isDrawerOpen,
                          })}
                        />
                      </div>
                    </Link>
                  </li>
                  <Divider className={cn({ hidden: !isDrawerOpen })} />
                </>
              ))}
      </ul>
    </div>
  );
}

const isAdminView = true;
const isAuthUser = true;
const user = {
  role: 'admin',
  // role: 'customer',
};

const Navbar: FC<NavbarProps> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <nav className="bg-white sticky w-full z-200 top-0 left-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex justify-between items-center mx-auto py-4 px-6 h-12">
          <Link
            href={'/'}
            className="text-gray-900 order-2 md:order-1 self-center no-underline text-2xl font-semibold whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded focus-visible:ring-offset-4">
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
          <div className="order-3 flex items-center justify-center">
            {isAuthUser ? (
              <>
                {user?.role !== 'admin' ? (
                  <Tooltip title="Shopping cart">
                    <ShoppingCartIcon
                      tabIndex={0}
                      role="button"
                      aria-label="Shopping cart"
                      className="text-gray-900 cursor-pointer p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600 rounded h-6 w-6"
                    />
                  </Tooltip>
                ) : null}
                <UserButton
                  user={user}
                  isAdminView={isAdminView}
                />
              </>
            ) : (
              <PrimaryButton>Sign In</PrimaryButton>
            )}
            <div className="flex md:order-2 gap-2"></div>
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
};

export default Navbar;
