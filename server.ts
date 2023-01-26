import express, {Request, Response} from 'express'


import { PrismaClient } from '@prisma/client'
import { request } from 'http'
import { rmSync } from 'fs'
const prisma = new PrismaClient()


const app = express()

app.get('/' ,async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.json(users)
})

app.get('/places' ,async (req: Request, res: Response) => {
    const places = await prisma.place.findMany({
        include: { creator: true}
    })
    res.json(places)
})

// app.post('/' ,(req: Request, res: Response) => {
//     res.json({message: "Hello i did it"})
// })

// app.patch('/' ,(req: Request, res: Response) => {
//     res.json({message: "Hello i did it"})
// })

// app.delete('/' ,(req: Request, res: Response) => {
//     res.json({message: "Hello i did it"})
// })

app.listen(5000)

// async function main() {
//     const user = await prisma.user.create({
//         data: {
//           email: 'elsa@prisma.io',
//           name: 'Elsa Prisma',
//           password: "1234",
//           image: "foo"
//         },
//       }) ;

//       const place = await prisma
//       console.log(user)   
// }

// // async function main() {
// //     await prisma.user.deleteMany()
// // }

// main()
//     .catch(e => {
//         console.error(e.message)
//     })
//     .finally(async () => {
//         await prisma.$disconnect
//     })