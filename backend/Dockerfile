FROM python:3.8

WORKDIR /app

COPY pip_requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000
EXPOSE 7000

CMD [ "python3", "main.py" ]