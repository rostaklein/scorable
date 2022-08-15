import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useState } from "react";
import { HiChevronLeft, HiPlus } from "react-icons/hi";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Layout } from "~/components/Layout";

import { createGame } from "~/models/game.server";
import { isValidString } from "~/utils/isValidString";

type ActionData = {
  name: null | string;
  identifier: null | string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");
  const urlIdentifier = formData.get("urlIdentifier");

  if (!isValidString(name) || !isValidString(urlIdentifier)) {
    return json<ActionData>({
      name: "Name is required",
      identifier: null,
    });
  }

  const game = await createGame({ name, urlIdentifier });

  return redirect(`/games/${game.urlIdentifier}`);
};

export default function NewGameRoute() {
  const errors = useActionData<ActionData>();
  const [urlIdentifier, setUrlIdentifier] = useState("");

  const onGameNameChange = (val: string) => {
    setUrlIdentifier(val.replace(/[^a-z0-9]/gim, " ").replace(/\s+/g, "_"));
  };

  return (
    <Layout title="Add new game">
      <Form method="post">
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <Input
            name="name"
            label="Game name"
            error={errors?.name}
            onDebouncedValueChange={onGameNameChange}
          ></Input>
        </div>
        <div className="text-sm pt-2 pb-4">
          <span>The game identifier:</span>{" "}
          <code className="text-xs bg-gray-100 py-1 px-3 text-gray-600 rounded-sm block sm:inline-block mt-2 md:mt-0">
            {urlIdentifier ? urlIdentifier : "Please type in the game name"}
          </code>
        </div>
        <input type="hidden" name="urlIdentifier" value={urlIdentifier} />
        <div>
          <Link to="/">
            <Button type="button">
              <HiChevronLeft className="inline-block -ml-1 mr-2" />
              Back
            </Button>
          </Link>
          <Button color="green" className="ml-2">
            <HiPlus className="inline-block -ml-1 mr-2" /> Add
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
