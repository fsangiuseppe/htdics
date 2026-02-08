# 📚 HTDICS — HTML Dictionaries  
HTDICS is a lightweight linguistic micro‑tool that transforms a single word into a fully structured HTML page, complete with translation, phonetic transcription, and — when applicable — full verb conjugations.

Designed for learners, teachers, and language enthusiasts, HTDICS uses the Copilot SDK and Claude Haiku 4.5 to generate clean, organized, browser‑friendly dictionary entries.

---

## ✨ Features

- Accepts a **word or verb** as a command‑line argument  
- Automatically detects whether the input is:
  - a noun  
  - a verb  
  - Italian or French  
- Generates:
  - French translation  
  - IPA phonetic transcription  
  - grammatical gender (for nouns)  
  - **full verb conjugations** (for verbs), including:
    - infinitive  
    - past participle  
    - passé composé  
    - future simple  
    - conditional present  
    - present subjunctive  
    - imperfect  
    - present indicative (all persons)  
- Produces a dedicated **HTML page** for each word  
- Automatically updates an **index HTML** file linking to all generated entries  

---

## 📂 Output Structure


Each word has its own standalone HTML page.  
The `index.html` file is updated automatically on every run.

---

## 🚀 Usage

You can run HTDICS using the `run` command followed by the script name and the word you want to translate.

Example:

```bash
run traduci1 correre
