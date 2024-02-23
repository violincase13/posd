from trycourier import Courier
import pika
import json
import sys, os
import time

time.sleep(60)

_courier_client = Courier(auth_token="pk_prod_R7WHY1E3E8M6EZKEV3CN8WC7XM1Z")
connection = []
def main():
    global connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()

    channel.queue_declare(queue='hello', durable=True)

    def callback(ch, method, properties, body):
        body = json.loads(body)
        mails = body['mails']
        news = body['news']
        print(body)
        for mail, name in mails.items():
            resp = _courier_client.send_message(
                message={
                    "to": {
                        "email": mail,
                    },
                    "template": "R3A2C1CBHJM6BFPZ2DJSTRCT4ZBV",
                    "data": {
                        'nume': name,
                        'titlu': news['titlu'],
                        'descriere': news['descriere'],
                        'user': news['user']
                    },
                }
            )

    channel.basic_consume(queue='hello', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        connection.close()
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)