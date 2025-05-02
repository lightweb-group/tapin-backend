import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// This is just an example route to demonstrate Prisma usage
// No actual database operations will happen until you define models in schema.prisma
router.get('/', async (req: Request, res: Response) => {
  try {
    // This is a placeholder to show you how to use the prisma client
    // You'll need to define models in your schema.prisma file before
    // you can perform actual database operations
    
    // Example of how you would use prisma once you have models:
    // const users = await prisma.user.findMany();
    
    res.status(200).json({ 
      message: 'Prisma is set up! Define models in schema.prisma to start using the database.' 
    });
  } catch (error) {
    console.error('Error in example route:', error);
    res.status(500).json({ error: 'An error occurred', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router; 