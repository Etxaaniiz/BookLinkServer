const app = require('./src/app');
const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Book Search Microservice running on http://localhost:${PORT}`);
});

console.log('Google Books API Key:', process.env.GOOGLE_BOOKS_API_KEY);