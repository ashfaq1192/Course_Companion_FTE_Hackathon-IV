"""
OAuth 2.0 Authorization Code Flow for Custom GPT per-user authentication.

Endpoints:
  GET  /oauth/authorize  — renders HTML login/register form
  POST /oauth/authorize  — validates credentials, issues auth code, redirects to callback
  POST /oauth/token      — exchanges auth code for JWT (Bearer token)
"""

import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Form, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.security import authenticate_user, create_access_token, get_password_hash
from ..database.session import get_db
from ..models.user import User

router = APIRouter(tags=["OAuth"])

# In-memory auth code store: {code: {email, expires_at, redirect_uri}}
_auth_codes: dict[str, dict] = {}

_LOGIN_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in — Course Companion FTE</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f0f4f8;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .card {{
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,.10);
      width: 100%;
      max-width: 420px;
      overflow: hidden;
    }}
    .header {{
      background: linear-gradient(135deg, #1a3a5c 0%, #2563eb 100%);
      padding: 28px 32px 24px;
      color: #fff;
    }}
    .header h1 {{ font-size: 1.4rem; font-weight: 700; margin-bottom: 4px; }}
    .header p  {{ font-size: .875rem; opacity: .85; }}
    .tabs {{
      display: flex;
      border-bottom: 2px solid #e5e7eb;
      padding: 0 32px;
      margin-top: 4px;
    }}
    .tab {{
      padding: 14px 0;
      margin-right: 24px;
      font-size: .9rem;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }}
    .tab.active {{ color: #2563eb; border-bottom-color: #2563eb; }}
    .form-body {{ padding: 24px 32px 32px; }}
    .field {{ margin-bottom: 16px; }}
    .field label {{ display: block; font-size: .85rem; font-weight: 500; color: #374151; margin-bottom: 6px; }}
    .field input {{
      width: 100%; padding: 10px 14px; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: .95rem; outline: none;
      transition: border-color .15s;
    }}
    .field input:focus {{ border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }}
    .btn {{
      width: 100%; padding: 12px; background: #2563eb; color: #fff;
      border: none; border-radius: 8px; font-size: 1rem; font-weight: 600;
      cursor: pointer; transition: background .15s;
    }}
    .btn:hover {{ background: #1d4ed8; }}
    .error {{
      background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px;
      padding: 10px 14px; color: #b91c1c; font-size: .875rem; margin-bottom: 16px;
    }}
    #register-form {{ display: none; }}
  </style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>Course Companion FTE</h1>
    <p>Sign in to sync your learning progress</p>
  </div>
  <div class="tabs">
    <div class="tab active" onclick="showTab('signin')">Sign In</div>
    <div class="tab" onclick="showTab('register')">Register</div>
  </div>
  <div class="form-body">
    {error_block}
    <form id="signin-form" method="post">
      <input type="hidden" name="action" value="signin">
      <input type="hidden" name="redirect_uri" value="{redirect_uri}">
      <input type="hidden" name="state" value="{state}">
      <input type="hidden" name="client_id" value="{client_id}">
      <div class="field">
        <label>Email</label>
        <input type="email" name="email" placeholder="you@example.com" required autofocus>
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" name="password" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn">Sign In</button>
    </form>
    <form id="register-form" method="post">
      <input type="hidden" name="action" value="register">
      <input type="hidden" name="redirect_uri" value="{redirect_uri}">
      <input type="hidden" name="state" value="{state}">
      <input type="hidden" name="client_id" value="{client_id}">
      <div class="field">
        <label>Full Name</label>
        <input type="text" name="full_name" placeholder="Jane Smith" required>
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" name="email" placeholder="you@example.com" required>
      </div>
      <div class="field">
        <label>Password</label>
        <input type="password" name="password" placeholder="••••••••" required minlength="8">
      </div>
      <button type="submit" class="btn">Create Account</button>
    </form>
  </div>
</div>
<script>
  function showTab(tab) {{
    document.getElementById('signin-form').style.display   = tab === 'signin'   ? '' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? '' : 'none';
    document.querySelectorAll('.tab').forEach((el, i) => {{
      el.classList.toggle('active', (i === 0) === (tab === 'signin'));
    }});
  }}
</script>
</body>
</html>"""


def _purge_expired_codes() -> None:
    now = datetime.utcnow()
    expired = [c for c, v in _auth_codes.items() if v["expires_at"] < now]
    for c in expired:
        del _auth_codes[c]


def _issue_auth_code(email: str, redirect_uri: str) -> str:
    _purge_expired_codes()
    code = secrets.token_urlsafe(32)
    _auth_codes[code] = {
        "email": email,
        "expires_at": datetime.utcnow() + timedelta(seconds=300),
        "redirect_uri": redirect_uri,
    }
    return code


@router.get("/oauth/authorize", response_class=HTMLResponse)
def oauth_authorize_get(
    client_id: str = "",
    redirect_uri: str = "",
    state: str = "",
    response_type: str = "code",
):
    """Render the OAuth login/register HTML form."""
    html = _LOGIN_HTML.format(
        redirect_uri=redirect_uri,
        state=state,
        client_id=client_id,
        error_block="",
    )
    return HTMLResponse(content=html)


@router.post("/oauth/authorize", response_class=HTMLResponse)
async def oauth_authorize_post(
    request: Request,
    action: str = Form(...),
    redirect_uri: str = Form(...),
    state: str = Form(""),
    client_id: str = Form(""),
    email: str = Form(...),
    password: str = Form(...),
    full_name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    """Process login or registration, then redirect to callback with auth code."""

    def error_page(msg: str) -> HTMLResponse:
        error_block = f'<div class="error">{msg}</div>'
        html = _LOGIN_HTML.format(
            redirect_uri=redirect_uri,
            state=state,
            client_id=client_id,
            error_block=error_block,
        )
        return HTMLResponse(content=html, status_code=400)

    if action == "register":
        # Check for existing user
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return error_page("An account with that email already exists. Please sign in.")
        if not full_name or not full_name.strip():
            return error_page("Full name is required.")
        if len(password) < 8:
            return error_page("Password must be at least 8 characters.")
        user = User(
            email=email,
            full_name=full_name.strip(),
            hashed_password=get_password_hash(password),
        )
        db.add(user)
        db.commit()

    else:  # signin
        user = authenticate_user(db, email, password)
        if not user:
            return error_page("Invalid email or password. Please try again.")

    code = _issue_auth_code(email=email, redirect_uri=redirect_uri)
    sep = "&" if "?" in redirect_uri else "?"
    callback_url = f"{redirect_uri}{sep}code={code}&state={state}"
    return RedirectResponse(url=callback_url, status_code=302)


@router.post("/oauth/token")
def oauth_token(
    grant_type: str = Form(...),
    code: str = Form(...),
    redirect_uri: str = Form(...),
    client_id: str = Form(""),
    client_secret: str = Form(""),
):
    """
    Exchange an auth code for a JWT access token.
    Called by ChatGPT automatically after the user authorises.
    """
    if grant_type != "authorization_code":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported grant_type",
        )

    if client_secret != settings.OAUTH_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid client_secret",
        )

    record = _auth_codes.get(code)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired authorization code",
        )

    if record["expires_at"] < datetime.utcnow():
        del _auth_codes[code]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code has expired",
        )

    if record["redirect_uri"] != redirect_uri:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="redirect_uri mismatch",
        )

    # Consume the code (one-time use)
    email = record["email"]
    del _auth_codes[code]

    access_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(days=7),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
