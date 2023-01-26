const express = require('express')
const { check } = require('express-validator')

const usersController = require('../controllers/users-controller')
const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const router = express.Router()

// router.get('/:uid', usersController.getuserByUserId)

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user login email
 *         password:
 *           type: string
 *           description: The user login password
 *       example:
 *         eamil: zeeshan@gmail.com
 *         password: 123456
 * 
 */


 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The User managing API
  */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: login user
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user successfull login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       500:
 *         description: Some server error
 */
//router.post('/', fileUpload.single('image'),

router.get('/', usersController.getUsers) //users

// sign up route
router.post('/signup', 
  fileUpload.single('image'),
[
    check("name")
        .not()
        .isEmpty(),
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('password').isLength({min:6})
], usersController.signup);

router.post('/login', usersController.login)




module.exports = router