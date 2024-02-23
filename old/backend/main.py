from infrastructure.db import connection
from api.api import app
from os import environ
from prometheus_client import start_http_server

FLASK_HOST = environ.get('FLASK_HOST', '0.0.0.0')

def main():
    connection()
    start_http_server(7000)

    app.run(host=FLASK_HOST, port=5000, debug=False)


if __name__ == '__main__':
    main()
