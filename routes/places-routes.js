const express = require('express')
const { check } = require('express-validator')

const checkAuth = require('../middleware/check-auth')
const placesController = require('../controllers/places-controller')
const fileUpload = require('../middleware/file-upload')




const router = express.Router()

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT  
 *
 * security:
    - bearerAuth: []     
 *   schemas:
 *     Place:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - address
 *         - image
 *         - creator
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the place
 *         title:
 *           type: string
 *           description: The place title
 *         description:
 *           type: string
 *           description: The place description
 *         address: 
 *           type: string
 *           description: The Address of User
 *         image: 
 *            type: string
 *            description: The image of the Place
 *         creator:
 *            type: string
 *            description: creator user ud
 *       example:
 *         id: d5fE_asz
 *         title: Lahore
 *         description: A beautiful city in pakistan
 *         address: Lahore Punjab Pakistan
 *         image: httpimageurl
 *         creator: zeeshan
 *          
 */


 /**
  * @swagger
  * tags:
  *   name: Places
  *   description: The Place managing API
  */

/**
 * @swagger
 * /places:
 *   get:
 *     summary: Find place by id
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: The Place founded
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Place'
 */



/**
 * @swagger
 * /api/places/{pid}:
 *   get:
 *     summary: Get the place by id
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The place id
 *     responses:
 *       200:
 *         description: The Place description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       404:
 *         description: The place was not found
 */

router.get('/:pid', placesController.getPlaceById);



router.get('/user/:uid', placesController.getPlacesByUserId);

router.use(checkAuth);

// Create Place Route

/**
 * @swagger
 * /api/places:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new place
 *     tags: [placess]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Place'
 *     responses:
 *       200:
 *         description: The place was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Place'
 *       500:
 *         description: Some server error
 */
//router.post('/', fileUpload.single('image'),

router.post('/', 
[
    // validate using express-validator 
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty()
], placesController.createPlace)



// Update Place route

/**
 * @swagger
 * /api/places/{pid}:
 *  patch:
 *    summary: Update the Place by the id
 *    tags: [Places]
 *    parameters:
 *      - in: path
 *        name: pid
 *        schema:
 *          type: string
 *        required: true
 *        description: The place id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Place'
 *    responses:
 *      200:
 *        description: The Place was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Place'
 *      404:
 *        description: The Place was not found
 *      500:
 *        description: Some error happened
 */
router.patch('/:pid', [
    // validate using express-validator 
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
], placesController.updatePlace)



/**
 * @swagger
 * /api/places/{id}:
 *   delete:
 *     summary: Remove the place by id
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The place id
 * 
 *     responses:
 *       200:
 *         description: The place was deleted
 *       404:
 *         description: The place was not found
 */


router.delete('/:pid',placesController.deletePlace)

module.exports = router; 