import { createClient } from "@/utils/supabase/server";
import { Button, Container } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?message=Please login first");
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <Container>
      <h1>Hello this is protected.</h1>
      <form action={signOut}>
        <Button type="submit">Logout</Button>
      </form>
    </Container>
  );
}
