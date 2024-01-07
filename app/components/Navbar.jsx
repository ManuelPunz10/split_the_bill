import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 flex justify-center text-white font-bold bg-black p-4 w-full">
      <div className="flex justify-between w-[600px]">
        <a className="specialA" href="/">
          User Hyusoko
        </a>
        <a className="specialA" href="/login">
          Log Out
        </a>
      </div>
    </nav>
  );
}
