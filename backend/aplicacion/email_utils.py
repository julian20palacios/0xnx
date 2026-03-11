import base64
import json
from urllib import request, parse

from decouple import config


OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"


def _get_gmail_access_token():
    client_id = config("GMAIL_CLIENT_ID", default=None)
    client_secret = config("GMAIL_CLIENT_SECRET", default=None)
    refresh_token = config("GMAIL_REFRESH_TOKEN", default=None)

    if not client_id or not client_secret or not refresh_token:
        raise ValueError("Faltan credenciales de Gmail para enviar correos.")

    data = parse.urlencode(
        {
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        }
    ).encode()

    req = request.Request(
        OAUTH_TOKEN_URL,
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )

    with request.urlopen(req, timeout=10) as response:
        payload = json.loads(response.read().decode("utf-8"))

    access_token = payload.get("access_token")
    if not access_token:
        raise ValueError("No se pudo obtener el access token de Gmail.")

    return access_token


def send_password_reset_code(to_email, code):
    provider = config("MAIL_PROVIDER", default="").strip().lower()
    if provider != "gmail_api":
        raise ValueError("MAIL_PROVIDER no esta configurado como gmail_api.")

    from_email = config("GMAIL_FROM", default=None)
    if not from_email:
        raise ValueError("Falta GMAIL_FROM en el entorno.")

    subject = "Codigo de recuperacion"
    body = (
        "Hola,\n\n"
        "Recibimos una solicitud para recuperar tu contrasena.\n"
        f"Tu codigo de verificacion es: {code}\n\n"
        "Si no solicitaste este cambio, puedes ignorar este mensaje.\n"
    )

    message = (
        f"From: {from_email}\r\n"
        f"To: {to_email}\r\n"
        f"Subject: {subject}\r\n"
        "MIME-Version: 1.0\r\n"
        'Content-Type: text/plain; charset="UTF-8"\r\n'
        "\r\n"
        f"{body}"
    )

    raw = base64.urlsafe_b64encode(message.encode("utf-8")).decode("utf-8")
    payload = json.dumps({"raw": raw}).encode("utf-8")

    access_token = _get_gmail_access_token()
    req = request.Request(
        GMAIL_SEND_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with request.urlopen(req, timeout=10) as response:
        if response.status < 200 or response.status >= 300:
            raise ValueError("Error al enviar el correo de recuperacion.")
