import passport from 'passport';
import { Router, Request, Response } from 'express';
import checkLoggedInMiddleware from '../middlewares/checkLoggedIn'

const fbAuthRouter = Router();

fbAuthRouter.get('/', (req, res) =>  {
  res.render('index.ejs');
});

fbAuthRouter.get('/facebook/profile', checkLoggedInMiddleware, (req: Request, res: Response) => {
  const email = (req?.user as any)?.emails?.length && (req?.user as any)?.emails[0].value || 'not provide'
  const photo = (req?.user as any)?.photos?.length && (req?.user as any)?.photos[0].value || null

  res.render('fbProfile.ejs', { user: { ...req.user, email, photo }});
});

fbAuthRouter.get('/facebook/error', checkLoggedInMiddleware, (req: Request, res: Response) => {
  res.render('error.ejs');
});

fbAuthRouter.get('/auth/facebook',
  passport.authenticate(
    'facebook',
    {
      scope: ['public_profile', 'email']
    }
  )
);

fbAuthRouter.get('/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/facebook/profile',
      failureRedirect: '/facebook/error'
    }
  )
);

fbAuthRouter.get('/logout', (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
});

export default fbAuthRouter;