"use client";
import React, { useEffect, useState, useMemo } from "react";
import supabase from "../supabaseConnection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Posts() {
  const [usersSupa, setUsersSupa] = useState([]);
  const [transactionsSupa, setTransactionsSupa] = useState([]);
  const [expensesSupa, setExpensesSupa] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

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
    async function fetchData() {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*");
        if (usersError) {
          console.error("Error fetching users data:", usersError);
          return;
        }

        const { data: transactionsData, error: transactionsError } =
          await supabase.from("transactions").select("*");
        if (transactionsError) {
          console.error("Error fetching transactions data:", transactionsError);
          return;
        }

        const { data: expensesData, error: expensesError } = await supabase
          .from("userTransaction")
          .select("*");
        if (expensesError) {
          console.error("Error fetching expenses data:", expensesError);
          return;
        }

        setUsersSupa(usersData);
        setTransactionsSupa(transactionsData);
        setExpensesSupa(expensesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  usersSupa.forEach((user) => {
    user.balance = 0;

    transactionsSupa.forEach((trans) => {
      if (trans.userId === user.userId) user.balance += trans.amount;
    });

    expensesSupa.forEach((exp) => {
      if (exp.userId === user.userId) user.balance -= exp.amount;
    });
  });

  if (!loggedInUser) return <div></div>;

  return (
    <div className="w-[600px] flex flex-col justify-center items-center">
      <Navbar key={loggedInUser} />
      <h1 className="w-[600px]">Smash Turnier</h1>
      <h2 className="w-[600px]">Overview</h2>
      <ul className="w-[600px]">
        {usersSupa.map((user) => (
          <div key={user.userId}>
            <li
              className="w-full flex justify-between p-2"
              onClick={() => handleTransactionClick(trans)}
            >
              <p>{user.username}</p>
              <p
                className={
                  user.balance < 0
                    ? "text-red-600"
                    : user.balance > 0
                    ? "text-green-600"
                    : "text-black"
                }
              >
                {user.balance >= 0
                  ? "+" + user.balance.toFixed(2)
                  : user.balance.toFixed(2)}
                €
              </p>
            </li>
          </div>
        ))}
      </ul>
      <button className="custom-btn btn-15 m-5">Add user</button>
      <ul className="w-[600px]">
        {transactionsSupa.map((trans) => (
          <Link href={`/bill/${trans.id}`} key={trans.id}>
            <li className="w-full flex justify-between expense items-center cursor-pointer p-2">
              <div>
                <p className="font-bold">{trans.title}</p>
                <p>
                  {
                    usersSupa.find((user) => user.userId === trans.userId)
                      ?.username
                  }
                </p>
              </div>
              <p>{trans.amount.toFixed(2)}€</p>
            </li>
          </Link>
        ))}
      </ul>
      <a className="custom-btn btn-15 m-5" href="./bill/new">
        Add Expense
      </a>
    </div>
  );
}
