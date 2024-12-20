import express from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN = "abc123def456ijk678lmn";
const REFRESH_TOKEN = "xyz123def456ijk678lmn";

let refreshTokens = [];

const app = express();

//for enable 'request.body'
app.use(express.json());

app.post('/token', (request, response) => {
    const refreshToken = request.body.token;
    if (!refreshToken) return response.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return response.sendStatus(403);
    jwt.verify(refreshToken, REFRESH_TOKEN, (error, user) => {
        if (error) return response.sendStatus(403);
        const accessToken = jwt.sign({ ...user, iat: Math.floor(Date.now() / 1000) }, ACCESS_TOKEN, { expiresIn: '2m' });
        response.send({ accessToken });
    });
});

app.post('/', (request, response) => {
    const accessToken = jwt.sign(request.body, ACCESS_TOKEN, { expiresIn: '2m' });
    const refreshToken = jwt.sign(request.body, REFRESH_TOKEN);
    refreshTokens.push(refreshToken);                       // ensure the token is added here
    response.send({ accessToken, refreshToken });
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

app.listen(3000, () => console.log("Server is running on http://localhost:3000"));