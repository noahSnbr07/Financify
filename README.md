* Clone Repository
> `git clone https://www.github.com/noahSnbr07/Financify`

* fill `.docker.env` with variables
> `touch .docker.env`

* Install Dependencies
> `npm install`

* Run Containers, Pull Ollama Model, Restart (deprecated)
> `docker compose up --build -d && docker exec -it Ollama ollama pull gemma:2b && docker compose down && docker compose up -d`

* Run Application
> `podman compose up --build -d`