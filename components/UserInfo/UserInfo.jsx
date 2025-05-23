"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "@node_modules/next/navigation";

export default function UserInfo() {
  /* const { data: session } = useSession(); */
  const router = useRouter();

  const handleBackHomePage = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    router.push("/");
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{/* session?.user?.lastName */}</span>
        </div>
        <div>
          Email: <span className="font-bold">{/* session?.user?.email */}</span>
        </div>
        <button
          onClick={handleBackHomePage}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
