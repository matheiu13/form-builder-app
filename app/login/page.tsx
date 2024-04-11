import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { Box, Button, Container, Flex, Text, TextInput } from "@mantine/core";
import { Auth } from "@supabase/auth-ui-react";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/protected");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  const loginWithGoogle = async () => {
    "use server";
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/protected",
      },
    });
  };

  return (
    <Container className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        Back
      </Link>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-5 text-foreground">
        <Flex direction="column" gap={4}>
          <Box>
            <TextInput
              withAsterisk
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </Box>
          <Box>
            <TextInput
              withAsterisk
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </Box>
          <Box pt={5}>
            <SubmitButton
              formAction={signIn}
              className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>
            <SubmitButton
              formAction={signUp}
              className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
              pendingText="Signing Up..."
            >
              Sign Up
            </SubmitButton>
          </Box>
          <Text>Or</Text>
          <Box>
            <Button onClick={loginWithGoogle}>Login with google</Button>
          </Box>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </Flex>
      </form>
    </Container>
  );
}
