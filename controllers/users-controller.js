const {v4: uuid} = require('uuid')
const HttpError = require('../models/http-error')
const {validationResult} = require('express-validator')
const prisma = require("../prisma/index");


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const user = require('../models/user')


const getUsers = async (req, res, next) => {
    let users;
    try {
      users = await prisma.user.findMany()
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json({users: users.map(user => user)});
  };

  const _changed_signup = async (req, res, next) => {
    try {
      console.log(req.body,"body")
      const createdUser = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          image: req.body.image
        }
      }) ;
      res.status(200).json({
        message: "place created sucessfully",
        createdUser,
      });
    } catch (error) {
      console.log("Error",error.message);
      res.status(400).json({
        message: "place not created",
      });
    }
  }


  const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { name, email, password } = req.body;
  
    // let existingUser;
    // try {
    //   existingUser = await prisma.user.findUnique({
    //     where: {
    //       email:email
    //     }
    //   })
    // } catch (err) {
    //   console.log("Error -- > " + err.message )
    //   const error = new HttpError(
    //     'Signing up failed, plesssase try again later.',
    //     500
    //   );
    //   return next(error);
    // }
  
    // if (existingUser) {
    //   const error = new HttpError(
    //     'User exists already, please login instead.',
    //     422
    //   );
    //   return next(error);
    // }
  
     let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        'Could not create user, please try again.',
        500
      );
      return next(error);
    }
  
    const createdUser = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        image: req.body.image
      }
    }) ;
  
    try {
      await createdUser
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        'supersecret_dont_share',
        { expiresIn: '1h' }
      );
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token });
  };


  const login = async (req, res, next) => {
    const { email, password } = req.body;
  console.log(email)
  console.log(password)
    let existingUser;
  
    try {
      existingUser = prisma.user.findUnique({
        where: {
          email: email
        },
  
      })
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (!existingUser) {
      const error = new HttpError(
        'Invalid credentials, could not log you in.',
        401
      );
      return next(error);
    }

    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        'supersecret_dont_share',
        { expiresIn: '1h' }
      );
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res.json({
    message: 'login Successfull', 
      userId: existingUser.id,
      email: existingUser.email,
      token: token
    });
  };
  
  

// exports.getuserByUserId=getuserByUserId
exports.getUsers=getUsers
exports.signup=signup
exports.login=login
