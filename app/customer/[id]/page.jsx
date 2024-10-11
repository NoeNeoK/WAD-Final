"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDetailPage({ params }) {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const [customer, setCustomer] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await fetch(`${APIBASE}/customer/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer");
        }
        const text = await response.text(); // Get the raw text of the response
        console.log("Raw response:", text); // Log the raw response
        const data = JSON.parse(text); // Try to parse it
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        // Handle error (e.g., show error message to user)
      }
    }

    if (id) {
      fetchCustomer();
    }
  }, [id, APIBASE]);

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to List
      </button>
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <p className="text-gray-900">{customer.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date of Birth:
          </label>
          <p className="text-gray-900">
            {new Date(customer.dateOfBirth).toLocaleDateString()}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Member Number:
          </label>
          <p className="text-gray-900">{customer.memberNumber}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Interests:
          </label>
          <p className="text-gray-900">{customer.interests}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created At:
          </label>
          <p className="text-gray-900">
            {new Date(customer.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Updated:
          </label>
          <p className="text-gray-900">
            {new Date(customer.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
