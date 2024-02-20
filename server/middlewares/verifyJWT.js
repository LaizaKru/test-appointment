const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/authUtils');

function verifyRefreshToken(req, res, next) {
  const { refresh } = req.cookies;

  try {
    const { user } = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
    res.locals.user = user;
    const { accessToken, refreshToken } = generateTokens({
      user: {
        id: user.id,
        login: user.login,
      },
    });
    res.cookie('access', accessToken, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
    });
    res.cookie('refresh', refreshToken, {
      maxAge: 1000 * 60 * 60 * 12,
      httpOnly: true,
    });

    next();
  } catch (error) {
    res.clearCookie('refresh');
    next();
  }
}

function verifyAccessToken(req, res, next) {
  const { access } = req.cookies;

  const { user } = jwt.verify(access, process.env.ACCESS_TOKEN_SECRET);
  res.locals.user = user;
  next();
}

function checkUser(req, res, next) {
  try {
    verifyAccessToken(req, res, next);
  } catch (error) {
    res.clearCookie('access');
    verifyRefreshToken(req, res, next);
  }
}

module.exports = checkUser;
