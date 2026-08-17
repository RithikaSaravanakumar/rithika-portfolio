# Rithika S Portfolio

A clean, professional personal portfolio website built with Python and Flask for an internship presentation. The site highlights education, projects, internship experience, certifications, accomplishments, and contact information using only the resume details provided.

## Features

- Responsive single-page portfolio layout
- Sticky navigation with mobile hamburger menu
- Experience timeline for internship roles
- Project showcase with tech badges and placeholder links
- Skills, education, certifications, and achievements sections
- Contact form with validation and success feedback
- Resume download placeholder for later PDF replacement

## Technology Stack

- Python 3
- Flask
- Jinja2
- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure

```text
portfolio/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
│   ├── base.html
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── files/
│   │   └── resume_placeholder.txt
│   └── images/
│       └── .gitkeep
└── .venv/
```

## Setup Instructions

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate the environment:

- Windows:

```bash
.venv\Scripts\activate
```

- macOS/Linux:

```bash
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## How to Run

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000/
```

## Screenshots

Placeholder for site screenshots to be added later.

## Future Improvements

- Add the actual PDF resume file once available
- Connect the contact form to an email service if required
- Add more portfolio content as projects and achievements evolve
