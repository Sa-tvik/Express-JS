import express, { request } from 'express';
import routes from "./routes/index.js"

const app = express();

app.use(express.json()) // top of code for fast parsing of json data from the request body
app.use(routes);

// app.use(loggingMiddleware); Globally logging middleware

const PORT = process.env.PORT || 3000;

// app.get("/", loggingMiddleware, (request, response) => {
//     response.status(201).send({msg:"hello"})
// })

app.get("/", (request, response) => {
    response.status(201).send({msg:"hello"})
})


app.listen(PORT, () =>{
    console.log(`Running on Port ${PORT}`)
});  
