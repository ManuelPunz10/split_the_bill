// CustomLoginPage.jsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthForm() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setLoggedInUser(user);
      setIsLoading(false);
    }

    fetchUser();
  }, []);

  const handleRegister = async () => {
    const response = await supabaseClient.auth.signUp({
      email: inputEmail,
      password: inputPassword,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setLoggedInUser(response.data.user);
    router.refresh();
    setInputEmail("");
    setInputPassword("");
  };

  const handleLogin = async () => {
    const response = await supabaseClient.auth.signInWithPassword({
      email: inputEmail,
      password: inputPassword,
    });
    setLoggedInUser(response.data.user);
    router.refresh();
    setInputEmail("");
    setInputPassword("");
  };

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.refresh();
    setLoggedInUser(null);
  };

  console.log({ isLoading, loggedInUser });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (loggedInUser) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-300">
            You're already logged in
          </h1>
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gray-700 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <input
          type="email"
          name="email"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleRegister}
          className="w-full mb-2 p-3 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none"
        >
          Register
        </button>
        <button
          onClick={handleLogin}
          className="w-full p-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 focus:outline-none"
        >
          Login
        </button>
      </div>
    </main>
  );
}
