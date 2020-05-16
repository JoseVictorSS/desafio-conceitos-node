const express = require("express");
const cors = require("cors");
const { uuid, isUuid  } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  if (!isUuid(request.params.id))
    return response.status(400).json({ message: "Not a valid ID!" })

  return next();
}

function checkRepositoryInArray(request, response, next) {
  const repository = repositories.find(r => r.id == request.params.id);

  if (!repository)
    return response.status(400).json({ message: "Repository not found!" });

  request.repository = repository;

  return next();

}

app.get("/repositories", (request, response) => {  
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", validateId, checkRepositoryInArray, (request, response) => {
  const { title, url, techs } = request.body;
  
  request.repository.title = title;
  request.repository.url = url;
  request.repository.techs = techs;

  return response.status(200).json(request.repository);

});

app.delete("/repositories/:id", validateId, checkRepositoryInArray, (request, response) => {
  repositories.splice(repositories.findIndex((r => r == request.repository), 1));

  return response.status(204).json({ message: "Repository removed."})

});

app.post("/repositories/:id/like", validateId, checkRepositoryInArray, (request, response) => {
  request.repository.likes++;

  return response.status(200).json(request.repository);

});

module.exports = app;
