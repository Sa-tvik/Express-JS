import { Router } from "express"; 
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.js";
import { createUserValidationSchema } from "../utils/validationSchemas.js";
import { resolveIndexUserById } from "../utils/middlewares.js";

const router = Router();

router.get("/api/users",
    query('filter')
    .isString()
    .notEmpty(),
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
})

router.get(
    '/api/users/:id',resolveIndexUserById, (request, response) =>{
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
})

router.post(
    '/api/users',
    checkSchema(createUserValidationSchema),
    (request, response) =>{ 

    const result = validationResult(request);
    console.log(result);
    if(!result.isEmpty())
        return response.status(400).send({ errors: result.array() })    

    const data = matchedData(request);    
    const newUser = {id:mockUsers[mockUsers.length-1].id+1, ...data }; // assigning new id
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})

//Only the change remains
router.put("/api/users/:id",resolveIndexUserById, (request, response) =>{
    const { body, findUserIndex } = request;
    
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200)
})

// one feild hanges while other remains
router.patch('/api/users/:id',resolveIndexUserById, (request, response) =>{
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
    return response.sendStatus(200);
})

router.delete('/api/users/:id',resolveIndexUserById, (request, response) =>{
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
})



export default router;