import { BackButton } from "@/components/backButton";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div>
      <BackButton text="Back to home" href="/" />
      <h1 className="text-2.5xl font-medium mb-2 mt-6 leading-10">
        Join the best community ever
      </h1>
      <h2 className="text-gray-600 text-xl mb-7 leading-loose">
        Create an account today
      </h2>
      <div className="h-[142.25px] w-[400px]">
        <SignUp />
      </div>
    </div>
  );
}
