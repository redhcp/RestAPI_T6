const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../model/contactos");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  "local-registro",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",

      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      console.log(user);
      if (user) {
        return done(
          null,
          false,
          req.flash("signupMessage", "The Email is already Taken.")
        );
      } else {
        const newUser = new User();
        newUser.name = req.body.name;
        newUser.last_name = req.body.last_name;
        newUser.tel1 = req.body.tel1;
        newUser.tel2 = req.body.tel2;
        newUser.doc = req.body.doc;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        console.log(newUser);
        await newUser.save();
        req.flash("registroMessage", "Usuario Creado Correntamente");
        done(null, newUser);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, req.flash("signinMessage", "No User Found"));
      }
      if (!user.comparePassword(password)) {
        return done(
          null,
          false,
          req.flash("signinMessage", "Incorrect Password")
        );
      }
      return done(null, user);
    }
  )
);
