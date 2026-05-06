from fastapi import APIRouter

auth_router = APIRouter(prefix="/auth", tags=["autenticação"])

@auth_router.get("/autentication")
async def autenticar():
    """
    Rota de Autenticação padrão do Turi-NE
    """
    return {"mensagem:": "Bem-vindo à rota de Autenticação!", "autenticado": False}