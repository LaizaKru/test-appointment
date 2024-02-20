const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { User } = require('../../db/models');
const generateTokens = require('../../utils/authUtils');
const jwtConfig = require('../../config/jwtConfig');

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(404).json({
        message: 'Такого пользователя не существует',
      });
    }

    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(403).json({
        message: 'Неправильный пароль',
      });
    }

    const userData = {
      id: user.id,
      login: user.login,
    };

    const { accessToken, refreshToken } = generateTokens({
      user: userData,
    });

    res.cookie(jwtConfig.access.type, accessToken, {
      maxAge: jwtConfig.access.expiresIn,
      httpOnly: true,
    });
    res.cookie(jwtConfig.refresh.type, refreshToken, {
      maxAge: jwtConfig.refresh.expiresIn,
      httpOnly: true,
    });

    return res.json({
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { login, password } = req.body;

  if (!login.trim() || !password.trim()) {
    res.status(400).json({ message: 'Заполните все поля' });
  }

  try {
    const foundUser = await User.findOne({ where: { login } });
    if (foundUser) {
      return res
        .status(400)
        .json({ message: 'Такой пользователь уже существует' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      login,
      password: hash,
    });

    const userData = {
      id: user.id,
      login: user.login,
    };

    const { accessToken, refreshToken } = generateTokens({
      user: userData,
    });

    res.cookie(jwtConfig.access.type, accessToken, {
      maxAge: jwtConfig.access.expiresIn,
      httpOnly: true,
    });
    res.cookie(jwtConfig.refresh.type, refreshToken, {
      maxAge: jwtConfig.refresh.expiresIn,
      httpOnly: true,
    });

    return res.json({
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get('/logout', (req, res) => {
  try {
    res.clearCookie(jwtConfig.access.type).clearCookie(jwtConfig.refresh.type);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/check', (req, res) => {
  if (res.locals.user) {
    res.json({ user: res.locals.user });
  } else {
    res.status(401).json({ message: 'Пользователь не аутентифицирован' });
  }
});
module.exports = router;
