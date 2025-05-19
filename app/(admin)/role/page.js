"use client";
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "@node_modules/next/navigation";
import Topbar from "@components/owner/component/layout/Topbar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = localStorage.getItem("token");

  // Fetch users when the component loads
  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch users failed:", response.status, errorText);
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  // useEffect(() => {
  //   // If the session is not yet loaded, do nothing
  //   if (status === "loading") return;

  //   // If there's no session or the role is not 'Owner', redirect
  //   if (user.role !== 'Admin') {
  //     router.push('/'); // Redirect non-Owner users to home
  //   }
  // }, [session, router]);

  // // Handle role change
  // const handleRoleChange = async (userId, newRole) => {
  //   if (!userId || !newRole) {
  //     alert("Invalid user ID or role");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/user", {
  //       method: "PATCH", // Use PATCH instead of PUT
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId, role: newRole }), // Send updated data
  //     });

  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       console.error("Error response:", errorMessage);
  //       throw new Error(`Failed to update user role: ${errorMessage}`);
  //     }

  //     // Update the local state with the new role
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user._id === userId ? { ...user, role: newRole } : user
  //       )
  //     );

  //     alert("User role updated successfully");
  //   } catch (err) {
  //     alert(`Error: ${err.message}`);
  //   }
  // };

  if (error) return <div>Error: {error}</div>;
  if (!session) return (
    <div className="min-h-screen min-w-screen z-50 flex justify-center items-center">
      <div>Loading...</div>
    </div>
  );

  return (

    <div className="flex justify-center items-center w-full​ h-full">
      <main className="w-10/12 ">

        <div>
          <Topbar />
        </div>
        <div className="w-full min-h-screen flex flex-col justify-center ">
          <h1>User Management</h1>
          <table className="w-full border border-gray-300 text-left mb-4">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-2 border border-gray-300">Name</th>
                <th className="p-2 border border-gray-300">Email</th>
                <th className="p-2 border border-gray-300">Role</th>
                <th className="p-2 border border-gray-300">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="User">User</option>
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
