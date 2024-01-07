"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../supabaseConnection";
import Posts from "../pages/page";
import Navbar from "../components/Navbar";

export default function AuthForm() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setLoggedInUser(user);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchUser();
  }, []);

  const handleSignUp = async () => {
    try {
      const res = await supabase.auth.signUp({
        email: inputEmail,
        password: inputPassword,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      setUser(res.data.user);
      router.refresh();
      setInputEmail("");
      setInputPassword("");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });

      if (error) {
        console.error("Error signing in:", error);
      } else {
        setUser(data.user);
        router.push("/pages");
        //router.refresh();

        setInputEmail("");
        setInputPassword("");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setInputEmail("");
    setInputPassword("");
    setLoggedInUser(null);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!loggedInUser) {
    return (
      <main className="h-screen flex items-center justify-center">
        <Navbar key={loggedInUser} />
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
            onClick={handleSignUp}
            className="w-full mb-2 p-3 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none"
          >
            Register
          </button>
          <button
            onClick={handleSignIn}
            className="w-full p-3 rounded-md bg-gray-600 text-white hover:bg-gray-700 focus:outline-none"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
