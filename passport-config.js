const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initializePassport(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        if (user == null) {
            return done(null, false, { message: 'No user with that username' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => done(null,user.id));
    // passport.deserializeUser((id, done) =>{ return done(null,getUserById(id))});
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'));
            }
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initializePassport;
