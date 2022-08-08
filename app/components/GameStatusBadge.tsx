import type { GameStatus } from "@prisma/client";
import { HiCheck, HiIdentification, HiRefresh } from "react-icons/hi";
import { Badge } from "./Badge";

type Props = {
  status: GameStatus;
  className?: string;
};

export const GameStatusBadge: React.FC<Props> = ({ status, className }) => {
  switch (status) {
    case "PREPARING":
      return (
        <Badge color="blue">
          <HiIdentification />
          <span className={className}>Preparing</span>
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge color="yellow">
          <HiRefresh />
          <span className={className}>In Progress</span>
        </Badge>
      );
    case "FINISHED":
      return (
        <Badge color="green">
          <HiCheck />
          <span className={className}>Finished</span>
        </Badge>
      );

    default:
      return null;
  }
};
