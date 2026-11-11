from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.solution import router as solutionRouter
from .routers.option import router as optionRouter

app = FastAPI(
title="CVRP API",
version="1.0.0",
)

origin="http://localhost:5173" # react app

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(solutionRouter)
app.include_router(optionRouter)


@app.get("/")
def read_root():
    return {"Hello": "World"}
