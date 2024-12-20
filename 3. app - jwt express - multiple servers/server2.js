import express from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN = "abc123def456ijk678lmn";

const app = express();

//for enable 'request.body'
app.use(express.json());

app.post('/', (request, response) => {
    const accessToken = jwt.sign(request.body, ACCESS_TOKEN);
    response.send(accessToken);
});

app.get('/', authenticateToken, (request, response) => {
    response.send(request.user);
});

function authenticateToken(request, response, next) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];   // Bearer TOKEN
    if (!token) return response.sendStatus(401);
    jwt.verify(token, ACCESS_TOKEN, ((error, user) => {
        if (error) return response.sendStatus(403);
        request.user = user;
        next();
    }));
}

app.listen(4000, () => console.log("Server is running on http://localhost:4000"));