import json
import re
from pathlib import Path
from typing import List, Optional


QUESTION_RE = re.compile(r"^\d+\.\s*(.+)")
ANSWER_RE = re.compile(r"^([+-])\s*(.+)")


def parse_questions(text: str) -> List[dict]:
    questions: List[dict] = []

    question_text: Optional[str] = None
    answers: List[str] = []
    correct_indexes: List[int] = []
    local_id = 1

    def flush():
        nonlocal question_text, answers, correct_indexes, local_id
        if question_text is None:
            return

        questions.append({
            "id": local_id,
            "question": question_text,
            "answers": answers,
            "correctIndexes": correct_indexes
        })

        local_id += 1
        question_text = None
        answers = []
        correct_indexes = []

    for raw in text.splitlines():
        line = raw.strip()

        if not line:
            continue

        # игнор мусора (номера страниц)
        if line.isdigit():
            continue

        # вопрос
        q = QUESTION_RE.match(line)
        if q:
            flush()
            question_text = q.group(1)
            continue

        # ответ
        a = ANSWER_RE.match(line)
        if a and question_text:
            sign, ans = a.groups()
            idx = len(answers)
            answers.append(ans.strip())
            if sign == "+":
                correct_indexes.append(idx)

    flush()
    return questions


def main():
    input_file = Path("input.txt")

    # 👇 ТУТ ТЫ ЗАДАЁШЬ ТЕМУ ВРУЧНУЮ
    topic_name = "zakon_kr_ob_osnovah_administrativnoy_deyatelnosti"

    output_file = Path(f"{topic_name}.json")

    text = input_file.read_text(encoding="utf-8")
    questions = parse_questions(text)

    output_file.write_text(
        json.dumps(questions, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"✔ {output_file.name}: {len(questions)} вопросов")


if __name__ == "__main__":
    main()
