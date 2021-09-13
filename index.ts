import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { fbConfigs } from './src/common/configs'
import fbAuthRouter from './src/routers/fbAuth.route'

const app: Application = express();
const port = 3000;

// Views
app.set('view engine', 'ejs');
app.set('views','./src/views');

// Session
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET_KEY'
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj: any, cb: Function) => {
  cb(null, obj);
});

// Passport-facebook
passport.use(new FacebookStrategy({
    clientID: fbConfigs.clientID,
    clientSecret: fbConfigs.clientSecret,
    callbackURL: fbConfigs.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name'], // <===
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get(
//   '/',
//   async (req: Request, res: Response): Promise<Response> => {
//     return res.status(200).send({
//       message: 'Hello World!',
//     });
//   }
// );

app.use('/', fbAuthRouter);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
