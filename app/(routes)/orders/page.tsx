"use client"

import axios from "axios";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
};

type OrderItem = {
  id: string;
  price: number;
  product: Product | null;
};

type Order = {
  id: string;
  createdAt: string;
  isPaid: boolean;
  price: number;
  orderItems: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch orders", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()} <br />
                Status: {order.isPaid ? "Paid" : "Unpaid"}
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {order.orderItems.map((item) => (
                  <li key={item.id}>
                    {item.product?.name ?? "Unknown Product"} — ${item.price}
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-semibold">
                Total: ${order.price?.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
