const app = require("./src/app");

const PORT = 3000
const server = app.listen(PORT, () => {
  console.log(`Web start with port 3000`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('exit server'))
})
