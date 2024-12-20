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

app.listen(3000, () => console.log("Server is running on http://localhost:3000"));