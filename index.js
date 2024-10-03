import express, { request } from 'express';
import routes from "./routes/index.js"
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

app.use(express.json()) // top of code for fast parsing of json data from the request body
app.use(cookieParser("helloworld"));
app.use(
    session({
        secret: "satvik",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,  
        }
    })
);
app.use(routes);

// app.use(loggingMiddleware); Globally logging middleware

const PORT = process.env.PORT || 3000;

// app.get("/", loggingMiddleware, (request, response) => {
//     response.status(201).send({msg:"hello"})
// })

app.get("/", (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    response.cookie('hello','world', {maxAge: 60000, signed: true })
    response.status(201).send({msg:"hello"})
})


app.listen(PORT, () =>{
    console.log(`Running on Port ${PORT}`)
});  
