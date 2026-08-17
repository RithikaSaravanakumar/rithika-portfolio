import html
import os
import re

import resend
from dotenv import load_dotenv
from flask import Flask, flash, redirect, render_template, request, send_file, url_for

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = "portfolio-secret-key"

CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "rithikasaravanakumar005@gmail.com")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
VALID_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/download_resume")
def download_resume():
    return send_file(
        "static/files/resume_placeholder.txt",
        as_attachment=True,
        download_name="resume_placeholder.txt",
        mimetype="text/plain",
    )


@app.route("/contact", methods=["POST"])
def contact():
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip()
    message = (request.form.get("message") or "").strip()

    if not name:
        flash("Name cannot be empty.", "error")
        return redirect(url_for("index", _anchor="contact"))

    if len(name) > 100:
        flash("Name must be 100 characters or fewer.", "error")
        return redirect(url_for("index", _anchor="contact"))

    if not email:
        flash("Email is required.", "error")
        return redirect(url_for("index", _anchor="contact"))

    if not VALID_EMAIL_RE.match(email):
        flash("Please enter a valid email address.", "error")
        return redirect(url_for("index", _anchor="contact"))

    if not message:
        flash("Message cannot be empty.", "error")
        return redirect(url_for("index", _anchor="contact"))

    if len(message) > 2000:
        flash("Message must be 2000 characters or fewer.", "error")
        return redirect(url_for("index", _anchor="contact"))

    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        flash(
            "Sorry, your message could not be sent right now. Please try again later or contact me directly by email.",
            "error",
        )
        return redirect(url_for("index", _anchor="contact"))

    safe_name = html.escape(name, quote=False)
    safe_email = html.escape(email, quote=False)
    safe_message = html.escape(message, quote=False).replace("\n", "<br>")

    try:
        resend.api_key = api_key
        payload = {
            "from": RESEND_FROM_EMAIL,
            "to": [CONTACT_EMAIL],
            "subject": f"New Portfolio Contact: {safe_name}",
            "html": (
                "<p><strong>Name:</strong> "
                f"{safe_name}</p>"
                "<p><strong>Email:</strong> "
                f"{safe_email}</p>"
                "<p><strong>Message:</strong><br>"
                f"{safe_message}</p>"
                "<p>This message was submitted through the contact form on Rithika S's portfolio.</p>"
            ),
        }

        response = resend.Emails.send(payload)
        if not response or not response.get("id"):
            raise RuntimeError("Resend did not accept the message.")

        flash("Thank you! Your message has been sent successfully.", "success")
        return redirect(url_for("index", _anchor="contact"))
    except Exception:
        flash(
            "Sorry, your message could not be sent right now. Please try again later or contact me directly by email.",
            "error",
        )
        return redirect(url_for("index", _anchor="contact"))


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
