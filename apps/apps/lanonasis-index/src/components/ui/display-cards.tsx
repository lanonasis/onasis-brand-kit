"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CardProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  dateClassName?: string;
  className?: string;
}

interface DisplayCardsProps {
  cards: CardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  return (
    <div className="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <div
          key={index}
          className={cn(
            "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:border-border/80 hover:shadow-md",
            card.className
          )}
        >
          <div className="space-y-2">
            <div className={cn("flex items-center gap-2", card.iconClassName)}>
              {card.icon}
            </div>
            <h3 className={cn("text-xl font-medium", card.titleClassName)}>
              {card.title}
            </h3>
            <p
              className={cn(
                "text-sm text-muted-foreground",
                card.descriptionClassName
              )}
            >
              {card.description}
            </p>
          </div>
          <div
            className={cn(
              "mt-4 text-xs text-muted-foreground",
              card.dateClassName
            )}
          >
            {card.date}
          </div>
        </div>
      ))}
    </div>
  );
}
