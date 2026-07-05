"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, Plus } from "lucide-react";
import Wordmark from "@/components/ui/Wordmark";
import Button from "@/components/ui/Button";

interface Props {
  // When rendered on the leaderboard, lets signed-in users who aren't
  // on the board yet open the join modal.
  isRegistered?: boolean;
  onJoin?: () => void;
}

export default function Navbar({ isRegistered = true, onJoin }: Props) {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark />

        {session ? (
          <div className="flex items-center gap-3">
            {!isRegistered && onJoin && (
              <Button onClick={onJoin}>
                <Plus size={15} />
                <span className="hidden sm:inline">Join Leaderboard</span>
                <span className="sm:hidden">Join</span>
              </Button>
            )}
            <span className="hidden max-w-[200px] truncate text-xs text-fg-muted md:block">
              {email}
            </span>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Sign out"
              className="px-2.5"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
          >
            Sign in
          </Button>
        )}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-70" />
    </header>
  );
}
