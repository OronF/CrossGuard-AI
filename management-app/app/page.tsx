import Login from "./login/Login";

export default function Home() {
  return (
    <div className="flex h-full w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Login></Login>
    </div>
  );
}
