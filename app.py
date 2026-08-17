from flask import Flask, render_template, send_file

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


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
