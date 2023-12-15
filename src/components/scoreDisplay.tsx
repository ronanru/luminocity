"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import SlotCounter from "react-slot-counter";
import { twMerge } from "tailwind-merge";
import { DownvoteIcon } from "./icons/downvote";
import { UpvoteIcon } from "./icons/upvote";

export const ScoreDisplay = ({
  score,
  vote,
  postId,
}: {
  score: number;
  vote?: boolean | null;
  postId: string;
}) => {
  const [currentScore, setCurrentScore] = useState(score);
  const [currentVote, setCurrentVote] = useState(vote);

  const setVoteMutation = api.post.setVote.useMutation({
    onSuccess: (newScore) => {
      setCurrentScore(newScore);
    },
  });

  const setVote = (vote: boolean | null) => {
    let newScore = currentScore;
    if (currentVote === true) newScore--;
    else if (currentVote === false) newScore++;
    if (vote === true) newScore++;
    else if (vote === false) newScore--;
    setCurrentScore(newScore);
    setCurrentVote(vote);
    setVoteMutation.mutate({ postId, vote });
  };

  return (
    <div className="flex gap-2.5 flex-col items-center">
      <button
        className={twMerge(
          "text-gray-700 hover:text-gray-800 transition-colors",
          currentVote === true && "text-indigo-500",
        )}
        onClick={() => {
          setVote(vote === true ? null : true);
        }}
      >
        <UpvoteIcon />
        <span className="sr-only">Upvote</span>
      </button>
      <div className="`font-medium text-gray-800 tabular-nums">
        <SlotCounter
          value={currentScore}
          duration={0.3}
          autoAnimationStart={false}
        />
      </div>
      <button
        className={twMerge(
          "text-gray-700 hover:text-gray-800 transition-colors",
          currentVote === false && "text-indigo-500",
        )}
        onClick={() => {
          setVote(vote === false ? null : false);
        }}
      >
        <DownvoteIcon />
        <span className="sr-only">Downvote</span>
      </button>
    </div>
  );
};
