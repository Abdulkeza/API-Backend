//!!Creating a function that can be added to a router to make it protected.
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

export function auth (req, res, next){
    //assign a token for a request
    const token = req.header('auth-token');      
    if(!token) return res.status(401).send('Access Denied!') //if user haven't token, he can't access some resources

    try {
        //verifying a req Token above with actual Token u have in .env file
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
        req.user = verified;

        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}