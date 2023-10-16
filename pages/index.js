import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-blue-900  w-screen h-screen flex items-center">
        <di className="text-center w-full">
          <button
            className="bg-white p-2 px-4 rounded-lg"
            onClick={() => signIn('google')}
          >
            Login with Google
          </button>
        </di>
      </div>
    );
  }

  return <div>Logged in</div>;
}
