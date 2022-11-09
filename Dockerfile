FROM       python:latest
RUN pip install flask

RUN mkdir /app

WORKDIR /app

RUN set -e

RUN export FLASK_ENV=development
RUN export FLASK_APP=server.py

CMD ["python","server.py"]