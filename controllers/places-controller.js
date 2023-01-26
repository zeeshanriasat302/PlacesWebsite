//const uuid = require('uuid');
const fs = require('fs')
const { v4: uuid} = require('uuid');
const HttpError = require('../models/http-error')
const {validationResult} = require('express-validator')
const prisma = require("../prisma/index");


const Place = require('../models/place')
const User = require('../models/user');
const { title } = require('process');



const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; 

  let place;
  try {
    place = await  prisma.place.findUnique({
      where: {
        id: placeId
      }
    }
    );
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }
                                  // getters : true removes underscore from our id property
  res.json({ place: place }); // => { place } => { place: place }
};



const changed_getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid; 

      try {
        const place = await prisma.place.findUnique({
          where: {
            id: placeId
          }
        }
        );
        console.log(place);
        res.status(200).json({ place });
      } catch (error) {
        return next(error)
      }
    }
  

  const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
  
    // let places;
    let userWithPlaces;
    try {
      userWithPlaces = await prisma.place.findUnique({
        where: {
          id: userId
        }
      }) // User.find(userId).populate('places');
    } catch (err) {
      const error = new HttpError(
        'Fetching places failed, please try again later',
        500
      );
      return next(error);
    }
  
    // if (!places || places.length === 0) {
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
      return next(
        new HttpError('Could not find places for the provided user id.', 404)
      );
    }
  
    res.json({
      places: userWithPlaces.places.map(place =>
        place.toObject({ getters: true })
      )
    });
  };
  
  const changed_createPlace = async (req,res,next)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        console.log(error);
        return next(
             new HttpError("invalid inputs passed, please check your data", 422)
        )
  }
    // const title = req.body.title
    const {title,description, address, creator} = req.body;
    const createdPlace = new Place({
        title,
        description,
        address,
        image: 'https://localhost:5000'+ req.file.path,
        creator
    });

    let user;

    try{
      user = await User.findById(creator)
    } catch (err) {
      const error = new HttpError(
        'Creating place failed, please try again',
        500
      );

      return next(error)
    }

    if(!user){
      const error = new HttpError(
        'Could not find user for provided id',
        404
      );
      return next(error)
    }

    console.log(user)
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess});
        await sess.commitTransaction();

    } catch  (err) {
        const error = new HttpError(
            'DB connection failed please try again.',
            500
        );
        return next(error);
    }

     res.status(201).json({place: createdPlace})
}

  const createPlace = async (req, res, next) => {
    try {
      console.log(req.body,"body")
      const createdPlace = await prisma.place.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          address: req.body.address,
          image: req.body.image
        }
      }) ;
      res.status(200).json({
        message: "place created sucessfully",
        createdPlace,
      });
    } catch (error) {
      console.log("Error",error.message);
      res.status(400).json({
        message: "place not created",
      });
    }
  }



const updatePlace = async (req, res) => {
  const placeId = req.params.pid; 
  console.log(placeId)

  try {
    const updatedPlace = await prisma.place.update({
      where: {
        id: placeId
      },
      data: {
        title: req.body.title,
        description: req.body.description,
      }
    }) ;
    res.status(200).json({
      message: "updated",
      updatedPlace,
    });
  }
 catch (error) {
    res.status(404).json({
      message: "Not Updated",
    });
  }
}



const deletePlace =   async (req, res) => {
  const placeId = req.params.pid;
  try {
    const deletePost = await prisma.place.delete({
      where: {
        id: placeId,
      },
    });
    res.status(200).json({
      status: "Deleted",
      place: deletePost,
    });
  } catch (error) {
    res.status(404).json({
      status: "not deleted",
    });
  }
}

  
  


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace=createPlace;
exports.updatePlace=updatePlace
exports.deletePlace=deletePlace
