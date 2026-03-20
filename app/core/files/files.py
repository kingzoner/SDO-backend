import os
import io
import tokenize
from pathlib import Path

from fastapi import UploadFile


def save_file(directory_path: str, file_name: str, file_content: bytes) -> str:
    Path(directory_path).mkdir(parents=True, exist_ok=True)
    file_path = os.path.join(directory_path, file_name)
    with open(file_path, 'wb') as file:
        file.write(file_content)
    return file_path


def delete_file(file_path: str) -> bool:
    try:
        os.remove(file_path)
        return True
    except FileNotFoundError:
        return False
    except Exception as error:
        return False


def check_type(file: UploadFile) -> (bool, str):
    if not file.filename.endswith('.py'):
        return False, 'Invalid file type. Only .py files are allowed.'
    return True, ''

def decode_python_source(file_content: bytes) -> tuple[bool, str]:
    """
    Корректно декодирует Python source file.
    Сначала пытается определить кодировку по правилам Python,
    затем использует безопасные fallback-варианты.
    """
    if not file_content:
        return False, "Uploaded file is empty."

    try:
        detected_encoding, _ = tokenize.detect_encoding(io.BytesIO(file_content).readline)
        return True, file_content.decode(detected_encoding)
    except Exception:
        pass

    fallback_encodings = [
        "utf-8",
        "utf-8-sig",
        "cp1251",
        "utf-16",
        "utf-16-le",
        "utf-16-be",
    ]

    for encoding in fallback_encodings:
        try:
            return True, file_content.decode(encoding)
        except UnicodeDecodeError:
            continue

    return False, (
        "Unable to decode file. Save the Python file in UTF-8 "
        "or specify source encoding in the file header."
    )