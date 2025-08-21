"use client";
import React, { useState } from "react";
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex md:hidden items-center space-x-2">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="mt-9 flex f">
            {/* Home Link */}
          

            <div className=" w-full flex flex-col justify-start space-y-2">
            
  <Button variant="ghost" className="flex  items-center gap-2" asChild>
              <Link href={"/"}>
                <HomeIcon className="w-4 h-4" />
                <span className="lg:inline">Home</span>
              </Link>
            </Button>
              <SignedIn>
                {/* When user is signed in */}
                <Button variant="ghost" className="flex items-center gap-2" asChild>
                  <Link href={"/notification"}>
                    <BellIcon className="w-4 h-4" />
                    <span>Notification</span>
                  </Link>
                </Button>

                <Button variant="ghost" className="flex items-center gap-2" asChild>
                  <Link href={"/profile"}>
                    <UserIcon className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </Button>

                <SignOutButton>
                  <Button variant="secondary" className="w-full">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </SignedIn>

              <SignedOut>
                {/* When user is signed out */}
                <SignInButton>
                  <Button variant="default" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}


// "use client";
// import React, { useState } from "react";
// import {
//   BellIcon,
//   HomeIcon,
//   LogOutIcon,
//   MenuIcon,
//   MoonIcon,
//   SunIcon,
//   UserIcon,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import Link from "next/link";
// import { ModeToggle } from "./ModeToggle";
// import { currentUser } from "@clerk/nextjs/server";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignOutButton,
//   SignUpButton,
//   useAuth,
//   UserButton,
// } from "@clerk/nextjs";
// import { useTheme } from "next-themes";

// async function MobileNavbar() {
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const { theme, setTheme } = useTheme();
//   const { isSignedIn } = useAuth();
//   const user = await currentUser();

//   return (
//     <div className="flex md:hidden  items-center  space-x-2">
//       <Button
//         variant="outline"
//         size="icon"
//         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       >
//         <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//         <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//         <span className="sr-only">Toggle theme</span>
//       </Button>

//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="ghost" size="icon">
//             <MenuIcon className="h-5 w-5" />
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="right" className="w-[300px]">
//           <SheetHeader>
//             <SheetTitle>Menu</SheetTitle>
//           </SheetHeader>
//           <nav>
//             <Button
//               variant="ghost"
//               className="flex items-center gap-2 justify-items-start"
//               asChild
//             >
//               <Link href={"/"}>
//                 <HomeIcon className="w-4 h-4" />
//                 <span className=" lg:inline">Home</span>
//               </Link>
//             </Button>

//             <div className="hidden md:flex items-center space-x-4">
//               <ModeToggle />

//               <Button
//                 variant="ghost"
//                 className="flex items-center gap-2 "
//                 asChild
//               >
//                 <Link href={"/"}>
//                   <HomeIcon className="w-4 h-4" />
//                   <span className="hidden lg:inline">Home</span>
//                 </Link>
//               </Button>

//               {user ? (
//                 <div className="flex">
//                   <Button
//                     variant="ghost"
//                     className="flex items-center gap-2 "
//                     asChild
//                   >
//                     <Link href={"/notification"}>
//                       <BellIcon className="w-4 h-4" />
//                       <span className="hidden lg:inline">Notification</span>
//                     </Link>
//                   </Button>

//                   <Button
//                     variant="ghost"
//                     className="flex items-center gap-2 "
//                     asChild
//                   >
//                     <Link
//                       href={"/profile"}
//                     >
//                       <UserIcon className="w-4 h-4" />
//                       <span className="">Profile</span>
//                     </Link>
//                   </Button>
               
//                   <SignOutButton>
//                     <Button variant="default" className="w-full">
//                       <LogOutIcon className="w-4 h-4 " />
//                       Logout
//                     </Button>
//                   </SignOutButton>
//                 </div>
//               ) : (
//                 <SignInButton>
//                   <Button variant="default" className="w-full">
//                     {" "}
//                     Sign In
//                   </Button>
//                 </SignInButton>
//               )}
//             </div>
//           </nav>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

// export default MobileNavbar;
