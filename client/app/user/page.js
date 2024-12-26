"use client";
import { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    token: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    token: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_APP_URL + "user");
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = () => {
    setIsEdit(false);
    setFormData({ id: null, username: "", email: "", token: "" });
    setShowModal(true);
    setErrors({username: "", email: "", token: "" });
  };

  const handleEdit = (user) => {
    setIsEdit(true);
    setFormData(user);
    setShowModal(true);
    setErrors({username: "", email: "", token: "" });
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}user/${userToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userToDelete));
        setShowDeleteModal(false);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleFormSubmit = async () => {
    let formIsValid = true;
    let validationErrors = { username: "", email: "", token: "" };

    if (!formData.username) {
      validationErrors.username = "Username is required.";
      formIsValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      validationErrors.email = "Email is required.";
      formIsValid = false;
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
      formIsValid = false;
    }

    if (!formData.token) {
      validationErrors.token = "Token is required.";
      formIsValid = false;
    } else if (formData.token.length < 6) {
      validationErrors.token = "Token should be at least 6 characters long.";
      formIsValid = false;
    }

    setErrors(validationErrors);

    if (!formIsValid) {
      return;
    }
    
    const url = isEdit
      ? `${process.env.NEXT_PUBLIC_APP_URL}user/${formData.id}`
      : `${process.env.NEXT_PUBLIC_APP_URL}user`;
  
    const method = isEdit ? "PUT" : "POST";
  
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();

        if (isEdit) {
          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) =>
              user.id === updatedUser.id ? updatedUser : user
            );
            return updatedUsers;
          });
        } else {
          setUsers((prevUsers) => [...prevUsers, updatedUser]);
        }
  
        setShowModal(false);
      } else {
        console.error("Failed to submit user");
      }
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!users.length) {
    return <p>No users found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Token</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.token}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-center">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleEdit(user)}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(user.id)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit User" : "Create User"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Token</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.token && <p className="text-red-500 text-sm">{errors.token}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
