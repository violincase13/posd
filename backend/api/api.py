from sys import stderr
from flask import Flask, request, jsonify, Response
from os import environ
from flask.helpers import make_response
from flask_cors import CORS, cross_origin
import json
from prometheus_client import Counter, Gauge, Summary, Histogram, Info, start_http_server
from authentication.authentication import m_requires_auth, m_requires_scope, requires_auth, requires_scope, AuthError
from infrastructure import db
from infrastructure.entity import Users, Patients, Doctors, Messages, MedicalRecords

app = Flask(__name__)
CORS(app)


USER_ID = 'user_id'
LONGITUDE = 'lng'
LATITUDE = 'lat'
TITLE = 'titlu'
TYPE = 'type'
TIME = 'time'
ID = 'id'
MONGO_ID = '_id'
ATTRACTION_POINT = 'attractionPoint'
URL = 'url'


FLASK_HOST = environ.get('FLASK_HOST', '0.0.0.0')
FLASK_PORT = int(environ.get('FLASK_PORT', 5000))

counter_checkpoint = Counter('add_checkpoint', 'Number of added checkpoints')
counter_news = Counter('add_news', 'Number of added news')


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/users', methods=['POST'])
def add_user():
    params = request.data   
    params = json.loads(params.decode('utf-8')) if params else None
    print(params, file=stderr)

    if not Users.validate(params):
        return Response(status=400)

    new_user = Users.init_from_dict(params)

    db.add_user(new_user)

    #counter_checkpoint.inc()
    return make_response(jsonify(new_user.to_nice_dict()), 201)


# @app.route('/addCheckpoint', methods=['POST'])
# @m_requires_auth
# def add_checkpoint():
#     params = request.data   
#     params = json.loads(params.decode('utf-8')) if params else None
#     print(params, file=stderr)

#     if not Checkpoints.validate(params):
#         return Response(status=400)

#     new_checkpoint = Checkpoints.init_from_dict(params)

#     db.add_checkpoint(new_checkpoint)

#     counter_checkpoint.inc()
#     return make_response(jsonify(new_checkpoint.to_nice_dict()), 201)

# GET REQUESTS
@app.route('/patients', methods=['GET'])
def get_patients():
    collection = db.patients
    patients_list = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find()]
    return jsonify(patients_list)

@app.route('/patients/<email>', methods=['GET'])
def get_patient(email):
    patient = db.get_patient(email, db.patients)
    return jsonify(patient)

@app.route('/patients/login?email=<email>&password=<password>', methods=['GET'])
def login(email, password):
    print("ok");
    query = request.args.getlist('email')
    print(query)
    query = request.args.getlist('password')
    print(query)
    print(email, password)
    patient = db.login_user(email, password, db.patients)
    return jsonify(patient)

@app.route('/doctors', methods=['GET'])
def get_doctors():
    collection = db.doctors
    doctors_list = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find()]
    return jsonify(doctors_list)

@app.route('/medicalRecords', methods=['GET'])
def get_medical_records():
    collection = db.medical_records
    medical_records_list = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find()]
    return jsonify(medical_records_list)

@app.route('/prescriptions', methods=['GET'])
def get_prescriptions():
    collection = db.prescriptions
    prescriptions_list = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find()]
    return jsonify(prescriptions_list)


# GET MEDICAL RECORDS FOR PATIENT WITH CERTAIN EMAIL
@app.route('/medicalRecords/<email>', methods=['GET'])
def get_medical_records_for(email):
    medical_records_list = db.get_medical_records_for(email, db.medical_records)
    return jsonify(medical_records_list)

# GET PRESCRIPTIONS FOR PATIENT WITH CERTAIN EMAIL
@app.route('/prescriptions/<email>', methods=['GET'])
def get_prescriptions_for(email):
    prescriptions_list = db.get_prescriptions_for(email, db.prescriptions)
    return jsonify(prescriptions_list)

# SEND MESSAGE
@app.route('/send', methods=['POST'])
def send_message():
    params = request.data   
    params = json.loads(params.decode('utf-8')) if params else None
    print(params, file=stderr)

    if not Messages.validate(params):
        return Response(status=400)

    new_message = Messages.init_from_dict(params)

    db.send_new_message(new_message)

    #counter_checkpoint.inc()
    return make_response(jsonify(new_message.to_nice_dict()), 201)

# GET MESSAGES WITH PATIENT
@app.route('/messages/<email>', methods=['GET'])
def get_messages_with(email):
    print("ok")
    messages_list = db.get_messages_with(email, db.messages)
    print(messages_list);
    return jsonify(messages_list)


# DELETE ALL
@app.route('/deleteAll', methods=['DELETE'])
def delete_all():
    db.delete_all()
    return Response(status=200)

# @app.route('/numCheckpoints', methods=['GET'])
# def get_num_checkpoins():
#     return jsonify(len(list(db.checkpoints.find())))


# @app.route('/numAttractionPoints', methods=['GET'])
# def get_num_attraction_points():
#     return jsonify(len(list(db.checkpoints.find({TYPE: ATTRACTION_POINT}))))

# @app.route('/addNews', methods=['POST'])
# # @cross_origin(headers=["Content-Type", "Authorization"])
# @m_requires_auth
# def add_news():
#     if not m_requires_scope():
#         raise AuthError({
#             "code": "Unauthorized",
#             "description": "You don't have access to this resource"
#         }, 403)
#     params = request.data
#     params = json.loads(params.decode('utf-8'))

#     if not News.validate(params):
#         return Response(status=400)
    
#     new_news = News.init_from_dict(params)
#     print(new_news)
#     db.add_news(new_news)

#     alertService.send_alert(new_news.to_nice_dict());

#     counter_news.inc()
#     return make_response(jsonify(new_news.to_nice_dict()), 201)





# @app.route('/lastWeekNews', methods=['GET'])
# def get_last_week_news():
#     return jsonify(db.get_last_week_checkpoins_by_type(ATTRACTION_POINT, db.news))
