"use client";
import React, { useState, useEffect } from "react";
import supabase from "../../supabaseConnection";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) {
          throw new Error(error.message);
        }
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const selectedUser = users.find((user) => {
        console.log("User:", user);
        console.log("Selected User ID:", userId);
        return user.userId === parseInt(userId);
      });
      if (!selectedUser) {
        throw new Error("Invalid user selected.");
      }

      const expenseData = {
        userId: selectedUser.userId,
        amount: parseFloat(amount),
        title: title,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("transactions")
        .insert([expenseData]);

      if (error) {
        throw new Error(error.message);
      }

      setTitle("");
      setAmount("");
      setUserId("");

      console.log("Expense added successfully:", data);
      router.push("/");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <>
      <div className="w-[600px] flex flex-col justify-center items-center border rounded-xl p-5">
        <h1 className="ml-10 w-[600px]">Smash Turnier</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="title">Titel:</label>
          <input
            className="pad-b"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
            name="title"
            placeholder="Insert Title"
            required
          />
          <label htmlFor="payer">Who paid?:</label>
          <select
            name="payer"
            className="pad-b"
            value={userId}
            onChange={(e) =>
              setUserId(e.target.options[e.target.selectedIndex].value)
            }
          >
            <option value="" disabled hidden>
              - Select User -
            </option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>
          <label htmlFor="name">Total:</label>
          <div className="flex">
            <input
              className="pad-b centered-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              id="name"
              name="name"
              min={0}
              placeholder="0.00"
              required
            />
            <p>€</p>
          </div>
          <h2 className="hField">Who has to pay how much?:</h2>
          {users.map((user) => (
            <div className="flex justify-between" key={user.id}>
              <label className="normal" htmlFor={`check_${user.id}`}>
                <input
                  className="mr-2"
                  type="checkbox"
                  name={`check_${user.id}`}
                  id={`check_${user.id}`}
                />
                {user.username}:
              </label>
              <p>
                <input
                  type="number"
                  className="w-[100px] border mr-1 number-field"
                  name={`portion_${user.id}`}
                  id={`portion_${user.id}`}
                  placeholder="0"
                  min={0}
                  value={user.portion}
                  onChange={(e) => handlePortionChange(user.id, e.target.value)}
                />
                €
              </p>
            </div>
          ))}
          <div className="w-full flex justify-end">
            <label className="mt-2 text-sm" htmlFor="split">
              or split equally
              <input className="ml-2" type="checkbox" name="split" id="split" />
            </label>
          </div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            className="border border-b-2 border-b-[#808080]"
            rows={3}
            type=""
            id="comment"
            name="comment"
            required
          />
          <div className="w-full flex justify-center pt-8">
            <button className="custom-btn btn-15 mb-2" type="submit">
              Add Expense
            </button>
          </div>
        </form>
      </div>
      <a className="custom-btn2 btn-16 mt-5" href="/">
        Cancel
      </a>
    </>
  );
}

export default Home;
