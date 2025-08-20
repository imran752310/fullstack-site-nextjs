import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <Button variant={"secondary"}>   Sign Up</Button>
        </SignUpButton>
      </SignedOut>
      
    </div>
  );
}
