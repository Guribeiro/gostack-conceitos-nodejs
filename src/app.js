const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const like = 1;

const validadeRepository = (request, response, next) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "repository not found" });
  }
  request.repositoryIndex = repositoryIndex;

  return next();
};

const validadeRepositorieId = (request, response, next) => {
  const { id } = request.params;

  const idExists = isUuid(id);

  if (!idExists) {
    return response.status(400).json({ message: "Repository ID not found" });
  }

  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const likes = 0;

  const repository = { id, title, url, techs, likes };

  try {
    repositories.push(repository);
    return response.status(200).json(repository);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

app.post(
  "/repositories/:id/like",
  validadeRepositorieId,
  validadeRepository,
  (request, response) => {
    const { id } = request.params;
    const repositoryIndex = request.repositoryIndex;

    const repository = repositories[repositoryIndex];
    
    repositories[repositoryIndex] = {
      ...repository,
      likes: repository.likes + 1,
    };

    return response.json(repositories[repositoryIndex]);
  }
);

app.put(
  "/repositories/:id",
  validadeRepositorieId,
  validadeRepository,
  (request, response) => {
    const { id } = request.params;
    const repositoryIndex = request.repositoryIndex;

    const { title, url, techs } = request.body;

    const repository = repositories[repositoryIndex];

    repositories[repositoryIndex] = {
      ...repository,
      title,
      url,
      techs,
    };

    return response.status(200).json(repositories[repositoryIndex]);
  }
);

app.delete(
  "/repositories/:id",
  validadeRepositorieId,
  validadeRepository,
  (request, response) => {
    const { id } = request.params;
    const repositoryIndex = request.repositoryIndex;

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  }
);

module.exports = app;
