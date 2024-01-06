from sys import stderr
from pymongo import MongoClient, ASCENDING
from os import environ
from datetime import datetime, timedelta
import requests
import random
from copy import deepcopy


USER_ID = 'user_id'
LONGITUDE = 'lng'
LATITUDE = 'lat'
TITLE = 'titlu'
TYPE = 'type'
TIME = 'time'
ID = 'id'
MONGO_ID = '_id'
DANGER_ZONE = 'danger'
FIRST_AID_ZONE = 'first_aid'
URL = 'url'

HOST = '127.0.0.1'

BASE_URL = f'http://{HOST}:5000/'

client = MongoClient(host='127.0.0.1')
db = client['database']
news = db.newss
checkpoints = db.checkpointss


def _assert(got, expected, message=''):
    assert got == expected, message + f'\ngot: {got}\nexpected: {expected}\n'


def test_delete_all():
    subpath = 'deleteAll'
    requests.delete(BASE_URL + subpath)
    _assert(len(list(checkpoints.find())), 0, subpath + ': delete checkpoints')
    _assert(len(list(news.find())), 0, subpath + ': delete news')


def test_add_checkpoint():
    subpath = 'addCheckpoint'
    requests.delete(BASE_URL + 'deleteAll')
    for i in range(30):
        new_checkpoint = {
            LONGITUDE: 10.2 + i, 
            LATITUDE: 12.3 + i, 
            TYPE: DANGER_ZONE if i % 2 == 0 else FIRST_AID_ZONE,
        }
        resp = requests.post(BASE_URL + subpath, json=new_checkpoint)
        # _assert(resp.status_code, 201, subpath + ': status_code')
        # _assert(resp.json()[ID], i,  subpath + ': id')
        # _assert(resp.json()[LONGITUDE], new_checkpoint[LONGITUDE],  subpath + ': lon')
        # _assert(resp.json()[LATITUDE], new_checkpoint[LATITUDE],  subpath + ': lat')
        # _assert(resp.json()[TYPE], new_checkpoint[TYPE],  subpath + ': type')
        _assert(len(list(checkpoints.find(new_checkpoint))), 1, subpath + ': not in database')


def test_last_checkpoints():
    subpath = 'lastCheckpoints'
    requests.delete(BASE_URL + 'deleteAll')
    added_checkpoints = []
    for i in range(20):
        time = datetime.today() - timedelta(hours=i)
        new_checkpoints = {
            ID: i, 
            LONGITUDE: 10.2 + i, 
            LATITUDE: 12.3 + i, 
            TYPE: DANGER_ZONE if i % 2 == 0 else FIRST_AID_ZONE,
            TIME: time
        }

        added_checkpoints.append(new_checkpoints)
    
    shuffle_check = deepcopy(added_checkpoints)
    random.shuffle(shuffle_check)
    for new_checkpoints in shuffle_check:
        checkpoints.insert_one(new_checkpoints)
        
    for new_checkpoints in added_checkpoints:
        del new_checkpoints[TIME]
        del new_checkpoints[ID]
    
    for param in ['', '/5', '/10', '/15']:
        resp = requests.get(BASE_URL + subpath + param)
        _assert(resp.status_code, 200, subpath + ': status_code')
        for got_news, expected_news in zip(resp.json(), added_checkpoints):
            # del got_news[TIME]
            _assert(got_news, expected_news, subpath)


def test_add_news():
    subpath = 'addNews'
    requests.delete(BASE_URL + 'deleteAll')
    for i in range(30):
        new_news = { TITLE: f'Stirea {i}' }
        new_news['user'] = f'https://www.google.com/search?q={i}'

        resp = requests.post(BASE_URL + subpath, json=new_news)
        _assert(resp.status_code, 201, subpath + ': status_code')
        # _assert(resp.json()[ID], i,  subpath + ': id')
        _assert(resp.json()[TITLE], new_news[TITLE],  subpath + ': title')
        _assert(resp.json().get('user'), new_news.get('user'),  subpath + ': url')
        _assert(len(list(news.find(resp.json()))), 1, subpath + ': not in database')

def test_last_news():
    subpath = 'lastNews'
    requests.delete(BASE_URL + 'deleteAll')
    added_news = []
    for i in range(20):
        time = datetime.today() - timedelta(hours=5 * i)
        new_news = {
            ID: i, TITLE: f'Stirea {i}', TIME: time, 
            'user': f'https://www.google.com/search?q={i}' if i % 2 == 0 else None
        }

        added_news.append(new_news)
    
    shuffle_news = deepcopy(added_news)
    random.shuffle(shuffle_news)
    for new_news in shuffle_news:
        news.insert_one(new_news)

    for new_news in added_news:
        del new_news[TIME]
        del new_news[ID]
    
    for param in ['', '/5', '/10', '/15']:
        resp = requests.get(BASE_URL + subpath + param)
        _assert(resp.status_code, 200, subpath + ': status_code')
        for got_news, expected_news in zip(resp.json(), added_news):
            if got_news.get(TIME):
                del got_news[TIME]
            _assert(got_news, expected_news, subpath)


def main():
    try:
        test_delete_all()
    except AssertionError as e:
        print(e)
    
    try:
        test_add_checkpoint()
    except AssertionError as e:
        print(e)
    
    try:
        test_last_checkpoints()
    except AssertionError as e:
        print(e)
    
    try:
        test_add_news()
    except AssertionError as e:
        print(e)

    try:
        test_last_news()
    except AssertionError as e:
        print(e)
    
    # resp = requests.delete(BASE_URL + "deleteAll")
    # for i in range(10):
    #     new_checkpoint = {
    #             LONGITUDE: 10.2 + 10 * i, 
    #             LATITUDE: 12.3 + 10 * i, 
    #             TYPE: FIRST_AID_ZONE,
    #         }
    #     resp = requests.post(BASE_URL + "addCheckpoint", json=new_checkpoint)
    
    # new_checkpoint[TYPE] = DANGER_ZONE
    # resp = requests.post(BASE_URL + "addCheckpoint", json=new_checkpoint)
    

    # resp = requests.get(BASE_URL + "lastCheckpoints/5")
    # print(*resp.json(), sep='\n')



if __name__ == '__main__':
    main()