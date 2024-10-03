import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

type SkeletonType = "card" | "text" | "largeDiv";

interface SkeletonLoaderProps {
  type: SkeletonType;
  count?: {
    card?: number;
    text?: number;
  };
}

export default function SkeletonLoader({ type, count }: SkeletonLoaderProps) {
  const { card = 1, text = 1 } = count || {};

  const renderSkeleton = (type: SkeletonType) => {
    switch (type) {
      case "card":
        return (
          <Card className="w-full max-w-md p-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        );
      case "text":
        return (
          <div className="space-y-2">
            {Array.from({ length: 1 }).map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className="h-4 w-4/5 md:w-2/5" />
              </React.Fragment>
            ))}
          </div>
        );
      case "largeDiv":
        return <Skeleton className="h-64 w-full" />;
      default:
        return null;
    }
  };

  const skeletonCount = type === "card" ? card : type === "text" ? text : 1; // Determine count based on type

  return (
    <div className="space-y-4">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton(type)}</React.Fragment>
      ))}
    </div>
  );
}
