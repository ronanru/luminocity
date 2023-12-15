import { BackButton } from "@/components/backButton";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div>
      <BackButton text="Back to home" href="/" />
      <h1 className="text-2.5xl font-medium mb-2 mt-6 leading-10">
        Welcome back!
      </h1>
      <h2 className="text-gray-600 text-xl mb-7 leading-loose">
        Choose a provider to log in with
      </h2>
      <div className="h-[142.25px] w-[400px]">
        <SignIn />
      </div>
    </div>
  );
}
