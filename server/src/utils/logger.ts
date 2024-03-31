import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log("________________________________________________");
    console.log("                                                ");
    console.log("                                                ");
    console.log("                                                ");
    console.log(req.method, req.path , req.query);
    
    next();
};

export default logger