"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_BASE;
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  async function fetchCustomers() {
    const data = await fetch(`${APIBASE}/customer`);
    const c = await data.json();
    setCustomers(c);
  }

  const startEdit = (customer) => () => {
    setEditMode(true);
    reset({
      ...customer,
      dateOfBirth: new Date(customer.dateOfBirth).toISOString().split("T")[0],
    });
  };

  const deleteCustomer = (id) => async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    const response = await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
    } else {
      alert("Customer deleted successfully");
      fetchCustomers();
    }
  };

  const createOrUpdateCustomer = async (data) => {
    const url = `${APIBASE}/customer${editMode ? `/${data._id}` : ""}`;
    const method = editMode ? "PUT" : "POST";

    console.log("Data being sent:", data); // Log the data being sent

    const formattedData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      memberNumber: parseInt(data.memberNumber, 10), // Ensure memberNumber is a number
    };

    console.log("Formatted data:", formattedData); // Log the formatted data

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      alert(`Customer ${editMode ? "updated" : "added"} successfully`);
      reset({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
      setEditMode(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error:", error);
      alert(
        `Failed to ${editMode ? "update" : "create"} customer: ${error.message}`
      );
    }
  };

  const navigateToCustomerDetail = (customerId) => {
    router.push(`/customer/${customerId}`);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-row gap-4 m-4">
      <div className="flex-1 w-64">
        <form onSubmit={handleSubmit(createOrUpdateCustomer)}>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>Name:</div>
            <div>
              <input
                {...register("name", { required: true })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>Date of Birth:</div>
            <div>
              <input
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>Member Number:</div>
            <div>
              <input
                type="number"
                {...register("memberNumber", { required: true })}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div>Interests:</div>
            <div>
              <input
                {...register("interests")}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
            </div>
            <div className="col-span-2 text-right">
              <button
                type="submit"
                className={`px-4 py-2 rounded ${
                  editMode
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {editMode ? "Update" : "Add"} Customer
              </button>
              {editMode && (
                <button
                  onClick={() => {
                    reset({
                      name: "",
                      dateOfBirth: "",
                      memberNumber: "",
                      interests: "",
                    });
                    setEditMode(false);
                  }}
                  className="ml-2 px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="flex-1 w-64">
        <h2 className="text-xl font-bold mb-4">Customer List</h2>
        <ul className="space-y-2">
          {customers.map((customer) => (
            <li key={customer._id} className="border p-2 rounded">
              <div className="flex justify-between items-center">
                <span
                  className="font-semibold cursor-pointer text-blue-600 hover:underline"
                  onClick={() => navigateToCustomerDetail(customer._id)}
                >
                  {customer.name}
                </span>
                <div>
                  <button
                    onClick={startEdit(customer)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={deleteCustomer(customer._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div>Member Number: {customer.memberNumber}</div>
              <div>
                Date of Birth:{" "}
                {new Date(customer.dateOfBirth).toLocaleDateString()}
              </div>
              <div>Interests: {customer.interests}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
