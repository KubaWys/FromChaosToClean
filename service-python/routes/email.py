from flask import Blueprint, request, jsonify

email_bp = Blueprint('email', __name__)

@email_bp.route("/send-email", methods=["POST"])
def send_email():
    email_data = request.json
    # NOTE: This is a stub. Integrate with real email service in production.
    to_email = email_data.get("to")
    subject = email_data.get("subject")
    body = email_data.get("body")

    print(f"FAKE EMAIL SENT:")  # Not real logging
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")

    return {"status": "sent", "message": "Email sent successfully"}  # Lying!
