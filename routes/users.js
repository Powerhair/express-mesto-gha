const express = require('express');

const router = express.Router();

const {
  getUsers,
  postUsers,
  findUsersById,
  updateUser,
  patchUsersAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.post('/users', postUsers);
router.get('/users/:id', findUsersById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', patchUsersAvatar);
