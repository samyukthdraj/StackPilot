// Remove unused import
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      subscriptionType: string;
    }

    interface Request {
      user?: User;
    }

    // Multer.File is already defined in @types/multer
    // We don't need to redefine it
  }
}

// This file is a module
export {};
