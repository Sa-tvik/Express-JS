import express, { request } from 'express';
import { query, validationResult, body } from "express-validator";
const app = express();

app.use(express.json()) // top of code for fast parsing of json data from the request body

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

// app.use(loggingMiddleware); Globally logging middleware

const resolveIndexUserById = (request, response, next) => {
    const { params: { id } } = request;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(
        (user) => user.id === parsedId)

    if(findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;
    next();
}

const PORT = process.env.PORT || 3000;


const mockUsers = [
    { id: 1, username: "satvik", displayName:"Satvik "},
    { id: 2, username: "arham", displayName:"Arham "},
    { id: 3, username: "b", displayName:"dsd  "},
];

// app.get("/", loggingMiddleware, (request, response) => {
//     response.status(201).send({msg:"hello"})
// })

app.get("/", (request, response) => {
    response.status(201).send({msg:"hello"})
})

// Can control request and send back response
// app.get("/",(request, response, next) => {
//     console.log("Base URL");
//     next();
// } , 
//     (request, response) => {
//     response.status(201).send({msg:"hello"})
// })

app.get('/api/users', 
    query('filter').isString().notEmpty(), 
    (request, response) => {
    const result =  validationResult(request);
    console.log(result);
    console.log(request.query);
    const { query: {filter, value},
    } = request;
    //When filter and value are undefined
    if(!filter && !value) return response.send(mockUsers);
    
    if(filter &&value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
    return response.send(mockUsers);
});

app.use(loggingMiddleware, (request, response, next) => {
    console.log("finished logging");
    next();
}); 

app.post('/api/users',
    body('username').notEmpty()
    .withMessage("username cannot be empty")
    .isLength({min: 5, max:32 })
    .withMessage("Username must be between 5 and 32 charcters long")
    .isString()
    .withMessage("must be a string"), 
    (request, response) =>{ 
    console.log(request.body); // Receiving ocnfirmation that the data is added
    const { body } = request;  // copy pasitng hte body of the json data of the request in the new user 
    const newUser = {id:mockUsers[mockUsers.length-1].id+1, ...body }; // assigning new id
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})

app.get('/api/users/:id',resolveIndexUserById, (request, response) =>{
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
})

app.get('/api/products', (request, response) =>{
    response.send([{ id: 123, name:' chicken', price: 80}])
})

app.listen(PORT, () =>{
    console.log(`Running on Port ${PORT}`)
});  

//Only the change remains
app.put("/api/users/:id",resolveIndexUserById, (request, response) =>{
    const { body, findUserIndex } = request;
    
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200)
})

// one feild hanges while other remains
app.patch('/api/users/:id',resolveIndexUserById, (request, response) =>{
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
    return response.sendStatus(200);
})

app.delete('/api/users/:id',resolveIndexUserById, (request, response) =>{
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
})