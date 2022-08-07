import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { HiChevronLeft, HiPlus } from "react-icons/hi";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Layout } from "~/components/Layout";

import { createGame } from "~/models/game.server";

type ActionData = {
  name: null | string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");

  if (typeof name !== "string" || name === "") {
    return json<ActionData>({
      name: "Name is required",
    });
  }

  const game = await createGame({ name });

  return redirect(`/games/${game.id}`);
};

export default function NewGameRoute() {
  const errors = useActionData<ActionData>();
  return (
    <Layout title="Add new game">
      <Form method="post">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <Input name="name" label="Game name" error={errors?.name}></Input>
        </div>
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
