"use client";
import React from "react";
import { useEffect, useState, useMemo, useReducer } from "react";
import supabase from "../supabaseConnection";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    setLoggedInUser(null);
  };

  return (
    <nav className="fixed top-0 left-0 flex justify-center text-white font-bold bg-black p-4 w-full">
      <div className="flex justify-between w-[600px]">
        <a className="specialA" href="/pages" id="headerTitle">
          User {loggedInUser ? loggedInUser.email : "not logged in"}
        </a>
        <a className="specialA" href="/login" onClick={handleLogout}>
          {loggedInUser ? "Log Out" : "Log in"}
        </a>
      </div>
    </nav>
  );
}
