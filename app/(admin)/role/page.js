"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserManagement = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/users", // ‼ no trailing space
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const payload = await response.json();
        const usersArray =
          Array.isArray(payload)
            ? payload
            : payload.data || payload.users || [];

        if (!Array.isArray(usersArray)) {
          throw new Error("Unexpected response format");
        }

        setUsers(usersArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleRoleChange = async (userId, newRole) => {
    // TODO: call your API to update the role
  };

  /* ---------- UI ---------- */
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error)   return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
      <div className="flex justify-center items-center w-full h-full">
        <main className="w-10/12">
          <h1 className="text-2xl font-semibold mb-4">User Management</h1>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
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
                  <tr key={user.id ?? user._id ?? index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                    <td className="p-2 border border-gray-300">{user.name}</td>
                    <td className="p-2 border border-gray-300">{user.email}</td>
                    <td className="p-2 border border-gray-300">{user.role}</td>
                    <td className="p-2 border border-gray-300">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id ?? user._id, e.target.value)}
                        className="border rounded p-1"
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
          )}
        </main>
      </div>
  );
};

export default UserManagement;
