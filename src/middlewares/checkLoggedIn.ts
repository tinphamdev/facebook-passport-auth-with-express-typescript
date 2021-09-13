import { Request, Response } from 'express';

export default (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
