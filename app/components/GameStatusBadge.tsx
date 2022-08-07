import type { GameStatus } from "@prisma/client";
import { HiCheck, HiIdentification, HiRefresh } from "react-icons/hi";
import { Badge } from "./Badge";

type Props = {
  status: GameStatus;
};

export const GameStatusBadge: React.FC<Props> = ({ status, children }) => {
  switch (status) {
    case "PREPARING":
      return (
        <Badge color="blue">
          <HiIdentification />
          <span>Preparing</span>
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge color="yellow">
          <HiRefresh />
          <span>In Progress</span>
        </Badge>
      );
    case "FINISHED":
      return (
        <Badge color="green">
          <HiCheck />
          <span>Finished</span>
        </Badge>
      );

    default:
      return null;
  }
};
