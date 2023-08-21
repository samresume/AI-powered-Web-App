FROM python:3.8.13-slim-buster

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

COPY requirements.txt /app/backend/


RUN pip install -r requirements.txt

COPY . /app/backend/

# CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]