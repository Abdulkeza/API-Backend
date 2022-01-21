//!!Creating a function that can be added to a router to make it protected.
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

export function auth (req, res, next){
    //assign a token for a request
    // const token = req.header('auth-token');      
    const authHeader = req.headers["authorization"]
    if(!authHeader) return res.status(401).json({message: 'Access Denied!'}) 

    const token = authHeader.split(" ")[1];

    try {
        //verifying a req Token above with actual Token u have in .env file
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
        req.user = verified;

        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}