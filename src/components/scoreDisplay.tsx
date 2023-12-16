"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import SlotCounter from "react-slot-counter";
import { twMerge } from "tailwind-merge";
import { DownvoteIcon } from "./icons/downvote";
import { UpvoteIcon } from "./icons/upvote";
import { ProtectedButton } from "./protectedButton";

export const ScoreDisplay = (
  props: {
    score: number;
    vote?: boolean | null;
  } & (
    | {
        postId: string;
        for: "post";
      }
    | {
        commentId: string;
        for: "comment";
      }
  ),
) => {
  const [currentScore, setCurrentScore] = useState(props.score);
  const [currentVote, setCurrentVote] = useState(props.vote);

  const commentMutation = api.comment.setVote.useMutation({
    onSuccess: (newScore) => setCurrentScore(newScore),
  });
  const postMutation = api.post.setVote.useMutation({
    onSuccess: (newScore) => setCurrentScore(newScore),
  });

  const setVote = (vote: boolean | null) => {
    let newScore = currentScore;
    if (currentVote === true) newScore--;
    else if (currentVote === false) newScore++;
    if (vote === true) newScore++;
    else if (vote === false) newScore--;
    setCurrentScore(newScore);
    setCurrentVote(vote);
    switch (props.for) {
      case "comment":
        commentMutation.mutate({
          commentId: props.commentId,
          vote,
        });
        break;
      case "post":
        postMutation.mutate({
          postId: props.postId,
          vote,
        });
        break;
    }
  };

  return (
    <div
      className={twMerge(
        "flex items-center",
        props.for === "post" && "flex-col gap-2.5",
        props.for === "comment" && "text-sm text-gray-700 leading-tight gap-2",
      )}
    >
      <ProtectedButton
        className={twMerge(
          "text-gray-700 hover:text-gray-800 transition-colors",
          props.for === "comment" && "w-4 h-4",
          currentVote === true && "text-indigo-500 hover:text-gray-600",
        )}
        onClick={() => setVote(currentVote === true ? null : true)}
      >
        <UpvoteIcon
          className={props.for === "comment" ? "w-4 h-4" : undefined}
        />
        <span className="sr-only">Upvote</span>
      </ProtectedButton>
      <div className="h-6 grid place-items-center">
        <SlotCounter
          value={currentScore}
          duration={0.3}
          valueClassName={twMerge(
            "font-medium tabular-nums",
            props.for === "post" && "text-gray-800",
          )}
          autoAnimationStart={false}
        />
      </div>
      <ProtectedButton
        className={twMerge(
          "text-gray-700 hover:text-gray-800 transition-colors",
          currentVote === false && "text-indigo-500 hover:text-gray-600",
        )}
        onClick={() => setVote(currentVote === false ? null : false)}
      >
        <DownvoteIcon
          className={props.for === "comment" ? "w-4 h-4" : undefined}
        />
        <span className="sr-only">Downvote</span>
      </ProtectedButton>
    </div>
  );
};
