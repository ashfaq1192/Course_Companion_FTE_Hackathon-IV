from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.auth import router as auth_router
from src.api.content import router as content_router
from src.api.dashboard import router as dashboard_router
from src.api.progress import router as progress_router
from src.api.quiz import router as quiz_router
from src.api.subscriptions import router as subscriptions_router
from src.api.hybrid_intelligence import router as hybrid_intelligence_router
from src.api.a2a import router as a2a_router
from src.api.mcp import router as mcp_router
from src.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS.split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routers
    app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
    app.include_router(dashboard_router, prefix=settings.API_V1_STR, tags=["Dashboard"])
    app.include_router(content_router, prefix=settings.API_V1_STR, tags=["Content"])
    app.include_router(progress_router, prefix=settings.API_V1_STR, tags=["Progress"])
    app.include_router(quiz_router, prefix=settings.API_V1_STR, tags=["Quiz"])
    app.include_router(subscriptions_router, prefix=settings.API_V1_STR, tags=["Subscriptions"])
    app.include_router(hybrid_intelligence_router, prefix=settings.API_V1_STR, tags=["Hybrid Intelligence"])
    app.include_router(a2a_router, prefix=settings.API_V1_STR, tags=["A2A Protocol"])
    app.include_router(mcp_router, prefix=settings.API_V1_STR, tags=["MCP"])

    # A2A Agent Card discovery endpoint (spec: /.well-known/agent.json)
    @app.get("/.well-known/agent.json", tags=["A2A Protocol"])
    def agent_card():
        from src.core.a2a import get_agent_card
        return get_agent_card()

    @app.get("/")
    def read_root():
        return {"message": "Course Companion FTE Backend API"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG
    )
