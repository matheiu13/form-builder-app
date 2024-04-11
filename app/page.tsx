import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello World!</h1>
      <div>
        <Link
          href="/login"
          className="font-bold hover:underline text-foreground/80"
        >
          Login
        </Link>{" "}
      </div>
    </main>
  );
}
