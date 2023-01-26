const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const mongoose = require('mongoose')


const cors = require("cors")
const morgan = require('morgan')

 const HttpError = require('./models/http-error')

 const swaggerUI = require('swagger-ui-express')
 const swaggerJsDoc = require('swagger-jsdoc')

 
 const placesRoutes = require('./routes/places-routes')
 const userRoutes = require('./routes/users-routes')


 const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};
 

 const specs = swaggerJsDoc(options)


const PORT = process.env.PORT || 4000;

 const DB = 'mongodb+srv://menu:menu123456@cluster0.mjb4ydr.mongodb.net/testplace?retryWrites=true&w=majority'
 const app = express()
 app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

 
    // app.use(bodyParser.json())
    app.use(cors())
    app.use(express.json())
    app.use(morgan("dev"))
  
      
    app.use('/api/places',placesRoutes)
    app.use('/api/users', userRoutes)
    app.use((req,res,next)=>{
        const error = new HttpError("could not found this route.", 404)
        throw error;
    })
    
    app.use((error, req,res,next)=>{
     
        if(res.headerSent){
            return next(error)
        }
        res.status(error.code || 500)
        res.json({message: error.message || "An unknown error occured"})
    })

    app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
// mongoose.set("strictQuery", false);

// mongoose
//   .connect(DB)
//   .then(() => {
//     app.listen(5000);
//   })
//   .catch(err => {
//     console.log(err);
//   });

//   mongoose.connect(DB)
//             .then(() => {
//                 app.listen(5000);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
