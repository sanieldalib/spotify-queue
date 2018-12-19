const isAuthenticated = (req, res, next) => {
	if (req.user) {
		return next();
	}

	// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
	res.redirect('/');
};

module.exports = isAuthenticated;
