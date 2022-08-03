import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
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

  await createGame({ name });

  return redirect("/games");
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
          <Button>Add</Button>
        </div>
      </Form>
    </Layout>
  );
}
