from flask import Flask, flash, redirect, render_template, request, send_file, url_for

app = Flask(__name__)
app.config["SECRET_KEY"] = "portfolio-secret-key"


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

    if not name or not email or not message:
        flash("Please fill in all fields before submitting your message.", "error")
        return redirect(url_for("index", _anchor="contact"))

    if "@" not in email or "." not in email.split("@")[-1]:
        flash("Please enter a valid email address.", "error")
        return redirect(url_for("index", _anchor="contact"))

    flash("Thank you for your message! I will get back to you soon.", "success")
    return redirect(url_for("index", _anchor="contact"))


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
