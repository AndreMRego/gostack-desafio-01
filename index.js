const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let qtd = 0;

server.use((req, res, next) => {
  qtd++;
  console.log(`Quantidade de requisições: ${qtd}`);

  return next();
});

function checkProjectExists(req, res, next) {
  const project = projects.find(obj => obj.id == req.params.id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id == id);
  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(obj => obj.id == id);

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(obj => obj.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
