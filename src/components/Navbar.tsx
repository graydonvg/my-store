'use client';

import { FC, useState } from 'react';
import { adminNavOptions, cn, navOptions } from '@/lib/utils';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import UserButton from './UserButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TemporaryDrawer from './TemporaryDrawer';

type NavbarProps = {};

const isAdminView = false;
const isAuthUser = true;
const user = {
  role: 'admin',
};

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
          ? adminNavOptions.map((option) => (
              <li
                key={option.id}
                className="list-none py-2 pl-3 pr-4 md:p-0">
                <Link
                  href={option.path}
                  className="no-underline text-gray-900">
                  {option.label}
                </Link>
              </li>
            ))
          : navOptions.map((option) => (
              <li
                key={option.id}
                className="list-none py-2 pl-3 pr-4 md:p-0">
                <Link
                  href={option.path}
                  className="no-underline text-gray-900">
                  {option.label}
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
}

const Navbar: FC<NavbarProps> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log('nav', isOpen);

  return (
    <>
      <nav className="bg-white fixed w-full z-200 top-0 left-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex justify-between items-center mx-auto py-4 px-6">
          <div className="flex order-2 md:order-1 items-center cursor-pointer truncate">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">MyStore</span>
          </div>
          {/* <div className="flex md:order-2 gap-2 md:visible">
            {!isAdminView && isAuthUser ? (
              <>
                <PrimaryButton>Account</PrimaryButton>
                <PrimaryButton>Cart</PrimaryButton>
              </>
            ) : null}
            {user?.role === 'admin' ? (
              isAdminView ? (
                <PrimaryButton>Client View</PrimaryButton>
              ) : (
                <PrimaryButton>Admin View</PrimaryButton>
              )
            ) : null}
            {isAuthUser ? <PrimaryButton>Sign Out</PrimaryButton> : <PrimaryButton>Sign In</PrimaryButton>}
            
          </div> */}
          <MenuIcon
            onClick={() => setIsOpen((prev) => !prev)}
            className="order-1 p-2 text-gray-500 md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 rounded"
          />
          <div className="md:order-2 md:block hidden">
            <NavOptions />
          </div>
          <span className="order-3 flex items-center justify-center">
            <ShoppingCartIcon className="text-gray-900" />
            <UserButton />
          </span>
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
