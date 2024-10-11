import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

export async function GET() {
  await dbConnect();
  const customers = await Customer.find().sort({ createdAt: -1 });
  return Response.json(customers);
}

export async function POST(request) {
  await dbConnect();
  try {
    const rawBody = await request.text(); // Get the raw body as text
    console.log("Raw request body:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const customer = new Customer(body);
    await customer.save();
    return Response.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request) {
  await dbConnect();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const customer = await Customer.findByIdAndUpdate(_id, updateData, {
    new: true,
  });
  if (!customer) {
    return new Response("Customer not found", { status: 404 });
  }
  return Response.json(customer);
}
