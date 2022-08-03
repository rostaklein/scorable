import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { Layout } from "~/components/Layout";

export default function NewGameRoute() {
  return (
    <Layout title="Add new game">
      <form method="post">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <Input name="name" label="Game name"></Input>
        </div>
        <div>
          <Button>Add</Button>
        </div>
      </form>
    </Layout>
  );
}
