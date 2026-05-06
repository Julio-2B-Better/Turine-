#uvicorn main:site --reload

from fastapi import FastAPI

site = FastAPI()

from auth_routes import auth_router
from order_routes import order_router

site.include_router(auth_router)
site.include_router(order_router)
