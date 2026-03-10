from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from jose import jwt
from saas_platform.backend.auth.jwt_auth import SECRET_KEY, ALGORITHM

class OrgMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract token and set app.org_id in DB session context
        auth_header = request.headers.get("Authorization")
        org_id = None
        
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                org_id = payload.get("org_id")
            except Exception:
                pass
        
        if org_id:
            # We will use this in the DB dependency to set the Postgres local variable
            request.state.org_id = org_id
            
        response = await call_next(request)
        return response

def get_db():
    # Placeholder for missing DB dependency
    raise NotImplementedError("Database not configured. Using mock mode.")

async def get_db_with_org(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Dependency that sets the Postgres 'app.org_id' for RLS.
    This must be called in every protected route.
    """
    if hasattr(request.state, "org_id"):
        await db.execute(text(f"SET app.org_id = '{request.state.org_id}'"))
    return db
