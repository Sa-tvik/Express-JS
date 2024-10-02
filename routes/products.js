import { Router } from "express"

const router = Router();

router.get('/api/products', (request, response) =>{
    response.send([{ id: 123, name:' chicken', price: 80}])
})

export default router;