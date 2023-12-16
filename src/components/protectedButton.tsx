import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { type ComponentProps } from "react";

export const ProtectedButton = ({
  ref: _,
  onClick,
  ...props
}: ComponentProps<"button">) => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <button onClick={onClick} {...props} />;

  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You must be logged in to perform this action
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href="/sign-in">Log In</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
