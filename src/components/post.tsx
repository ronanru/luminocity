import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Post as PostType } from "@/server/db/schema";
import { type User } from "@clerk/nextjs/server";
import Link from "next/link";
import { ScoreDisplay } from "./scoreDisplay";
import { Time } from "./time";

export const Post = ({
  createdAt,
  score,
  text,
  title,
  user,
  vote,
  id,
  isLink,
}: PostType & {
  user: Pick<User, "imageUrl" | "username">;
  vote?: boolean | null;
  isLink?: boolean;
}) => {
  const Component = isLink ? Link : "div";
  return (
    <>
      <div className="flex gap-4">
        <ScoreDisplay score={score} vote={vote} postId={id} />
        <Component href={`/posts/${id}`} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.username?.[0]}</AvatarFallback>
            </Avatar>
            <p className="text-gray-600 text-sm leading-tight">
              Posted by {user.username} <Time date={createdAt} />
            </p>
          </div>
          <p className="text-gray-900">{title}</p>
          <p className="whitespace-pre-wrap text-gray-700 text-sm leading-tight">
            {text}
          </p>
        </Component>
      </div>
    </>
  );
};
