import type { Team } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useState } from "react";
import { HiOutlineTrash, HiPlus } from "react-icons/hi";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";

type Props = {
  gameId: string;
  teams: Omit<Team, "createdAt" | "updatedAt">[];
};

export const TeamsList: React.FC<Props> = ({ teams, gameId }) => {
  const [newTeamName, setNewTeamName] = useState("");
  return (
    <div>
      {teams.length === 0 && (
        <div className="text-center text-gray-400 text-sm p-3">
          No teams yet
        </div>
      )}
      {teams.map((team) => (
        <Form
          className="flex items-end mb-2 w-full"
          method="post"
          key={team.id}
        >
          <Input
            name="name"
            placeholder="Cool guys"
            initialValue={team.name}
            className="h-10"
            wrapperClassname="flex-1"
          />
          <input type="hidden" value={team?.id} name="teamId" />
          <div className="ml-3 flex">
            <Button
              className="mr-3 h-10"
              name="intent"
              value="update-team"
              size="small"
            >
              Update
            </Button>
            <Button
              size="small"
              name="intent"
              value="remove-team"
              className="h-10"
              onClick={(e) => {
                if (!confirm("Are you sure?")) {
                  e.preventDefault();
                }
              }}
            >
              <HiOutlineTrash className="text-[16px]" />
            </Button>
          </div>
        </Form>
      ))}
      <h3 className="font-bold mb-3 mt-6">Add new team</h3>
      <Form
        className="flex items-end mb-2 w-full"
        method="post"
        onSubmit={() => setNewTeamName("")}
      >
        <Input
          name="name"
          placeholder="Cool guys"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="h-10"
          wrapperClassname="flex-1"
        />
        <input type="hidden" value={gameId} name="gameId" />
        <div className="ml-3">
          <Button
            color="green"
            className="h-10 w-32 flex-nowrap"
            name="intent"
            value="add-team"
          >
            <HiPlus className="inline-block" /> Add
          </Button>
        </div>
      </Form>
    </div>
  );
};
