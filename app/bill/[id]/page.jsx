"use client";
import { useEffect, useState } from "react";
import supabase from "../../supabaseConnection";

export default function ExpensePage({ params }) {
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [users, setUsers] = useState([]);
  const [payedByUser, setpayedByUser] = useState("");
  const [positiveAmounts, setPositiveAmounts] = useState([]);

  useEffect(() => {
    const retrieveExpenseDetails = async () => {
      const { data: expenseData, error: expenseError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", params.id)
        .single();
      if (expenseError) {
        console.error(expenseError);
      } else {
        setTitle(expenseData.title);
        setTotal(expenseData.amount);
        setCreatedAt(expenseData.created_at);
      }

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*");
      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from("userTransaction")
          .select("*")
          .eq("transactionId", params.id);

      if (usersError || transactionsError) {
        console.error(usersError || transactionsError);
      } else {
        const updatedUsers = usersData.map((user) => {
          const userTransactions = transactionsData.filter(
            (transaction) =>
              transaction.userId === user.userId && transaction.amount < 0
          );
          const totalAmount = userTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
          );
          return {
            ...user,
            amount: totalAmount,
          };
        });
        setUsers(updatedUsers);
      }
      const payedById = expenseData.userId;
      const { data: payedByNameData, error: payedByNameError } = await supabase
        .from("users")
        .select("username")
        .eq("userId", payedById)
        .single();
      if (payedByNameError) {
        console.error(payedByNameError);
      } else {
        setpayedByUser(payedByNameData.username);
      }
      const { data: positveTransactionsData, error: poitiveTransactionsError } =
        await supabase
          .from("userTransaction")
          .select("*")
          .eq("transactionId", params.id)
          .gt("amount", 0);

      if (poitiveTransactionsError) {
        console.error(poitiveTransactionsError);
      } else {
        setPositiveAmounts(positveTransactionsData);
      }
    };
    retrieveExpenseDetails();
  }, []);

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}. ${month} ${year}, ${hours}:${minutes}`;
  };
  const formattedCreatedAt = createdAt ? formatCreatedAt(createdAt) : "";

  for (let i = 0; i < users.length; i++) {
    let user = users[i];

    positiveAmounts.forEach((expense) => {
      if (expense.userId === user.userId) {
        user.amount = expense.amount;
        return;
      }
    });
  }

  return (
    <div className="w-[600px] flex flex-col justify-center items-center">
      <div className="container-table">
        <h1 className="w-[600px]">Smash Turnier</h1>
        <h2 className="w-[600px]">{title}</h2>
        <p className="mb-2">{formattedCreatedAt}</p>
        <table className="table w-full">
          <tbody>
            {users.map((user) => (
              <tr
                className="table-row w-full flex justify-between "
                key={user.id}
              >
                <td className="table-cell">{user.username}</td>
                <td className={"table-cell text-red-500 text-end"}>
                  -{user.amount.toFixed(2)} €
                </td>
              </tr>
            ))}
            <tr className="table-row border-t-2 border-black">
              <td className="table-cell">{payedByUser}</td>
              <td className={"table-cell text-green-600 text-end"}>
                {parseFloat(total).toFixed(2)} €
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-col justify-center items-center">
          <a href="/pages">
            <button className="custom-btn2 btn-16 mt-5">Back</button>
          </a>
        </div>
      </div>
    </div>
  );
}
