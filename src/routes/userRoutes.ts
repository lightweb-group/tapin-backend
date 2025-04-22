import { Router, Request, Response } from "express";

const router = Router();

// Simple in-memory data store to replace Prisma
interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let users: User[] = [
  {
    id: 1,
    email: "user@example.com",
    name: "Example User",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
let nextId = 2;

// Get all users
router.get("/", (req: Request, res: Response) => {
  res.json(users);
});

// Get user by ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// Create a new user
router.post("/", (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const newUser: User = {
    id: nextId++,
    email,
    name: name || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name } = req.body;
  const userId = Number(id);

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    email: email || users[userIndex].email,
    name: name !== undefined ? name : users[userIndex].name,
    updatedAt: new Date(),
  };

  res.json(users[userIndex]);
});

// Delete a user
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = Number(id);

  const initialLength = users.length;
  users = users.filter((u) => u.id !== userId);

  if (users.length === initialLength) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(204).send();
});

export default router;
