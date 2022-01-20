export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ATLP Adeodatus",
      description: "This is a backend APIs for my Capstone project",
      version: "1.0.0",
      contact: {
        name: "Adeodatus",
        email: "adeoabdul.a@gmail.com",
        url: "https://laughing-hopper-c7fb0a.netlify.app/index.html",
      },
    },
    servers: [
      {
        url: "http://localhost:9000",
        name: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
