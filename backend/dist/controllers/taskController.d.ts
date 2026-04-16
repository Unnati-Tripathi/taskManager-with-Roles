import { Request, Response, NextFunction } from 'express';
declare module 'express' {
    interface Request {
        user?: any;
    }
}
export declare const createTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTasks: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTaskById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=taskController.d.ts.map