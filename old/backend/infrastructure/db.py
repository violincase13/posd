from pymongo import MongoClient, ASCENDING
from os import environ
from sys import stderr
from datetime import datetime, timedelta
from infrastructure.entity import Users, Patients, Doctors, Messages, MedicalRecords

CONNECTION_STRING = "mongodb+srv://dumitrescucgeorgiana:SetIAiwpUq860U0h@cluster0.oelyqx7.mongodb.net/?retryWrites=true&w=majority"
TIME = 'time'
ID = 'id'
TYPE = 'type'
ROLE = 'role'

current_doctor_id = 0 
doctors = []
current_patient_id = 0 
patients = []
current_message_id = 0
messages = []
current_medical_record_id = 0
medical_records = []
current_prescription_id = 0
prescriptions = []

def connection():
    global doctors
    global patients
    global messages
    global medical_records
    global prescriptions
    
    global current_doctor_id
    global current_patient_id
    global current_message_id
    global current_medical_record_id
    global current_prescription_id

    try:
        client = MongoClient(CONNECTION_STRING)
        db = client['database']
    except Exception as e:
        print(e, file=stderr)

    try:
        doctors = db.doctors
        patients = db.patients
        messages = db.messages
        medical_records = db.medical_records
        prescriptions = db.prescriptions

    except Exception as e:
        print(e, file=stderr)

    try:
        current_doctor_id = len(list(doctors.find()))
        current_patient_id = len(list(patients.find()))
        current_message_id = len(list(messages.find()))
        current_medical_record_id = len(list(medical_records.find()))
        current_prescription_id = len(list(prescriptions.find()))

    except Exception as e:
        print(e, file=stderr)
    
    try:
        print(db.list_collection_names())
        print(f'current_doctor_id: {current_doctor_id}; current_patient_id: {current_patient_id}; current_message_id: {current_message_id}; current_medical_record_id: {current_medical_record_id}; current_prescription_id: {current_prescription_id}')
    except Exception as e:
        print(e, file=stderr)
 

def delete_all():
    doctors.delete_many({})
    patients.delete_many({})
    messages.delete_many({})
    medical_records.delete_many({})
    prescriptions.delete_many({})

    global current_doctor_id, current_patient_id
    current_message_id, current_medical_record_id, current_prescription_id = 0, 0

# ADD USER
def add_user(user):
    if user.role == 'patient':
        add_patient(user)

    elif user.role == 'doctor':
       add_doctor(user)

def login_user(email, password, collection):
    print(email);
    print(password);
    patient = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find( { "$and": [{"email": email}, {"password": password}]} )]
    return patient


# ADD DOCTOR
def add_doctor(doctor):
    global current_doctor_id
    try:
        doctors.insert_one(doctor.to_dict())
        current_doctor_id += 1
    except Exception as e:
        print(e)

# ADD PATIENT
def add_patient(patient):
    global current_patient_id
    try:
        patients.insert_one(patient.to_dict())
        current_patient_id += 1
    except Exception as e:
        print(e)

def get_patient(email, collection):
    patient = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find({ "email": email } )]
    return patient

# ADD NEW MESSAGE
def add_new_message(new_message):
    global current_message_id
    try:
        messages.insert_one(new_message.to_dict())
        current_message_id += 1
    except Exception as e:
        print(e) 

# ADD NEW MEDICAL RECORD
def add_medical_record(medical_record):
    global current_medical_record_id
    try:
        medical_records.insert_one(medical_record.to_dict())
        current_medical_record_id += 1
    except Exception as e:
        print(e)


def get_medical_records_for(email, collection):
    medical_records = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find({ "assignedTo": email } )]
    # medical_records.sort(key=lambda x: x[ID])

    return medical_records

# ADD NEW PRESCRIPTION
def add_prescription(prescription):
    global current_prescription_id
    try:
        prescriptions.insert_one(prescription.to_dict())
        current_prescription_id += 1
    except Exception as e:
        print(e)

def get_prescriptions_for(email, collection):
    prescriptions = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find({ "assignedTo": email } )]
    # prescriptions.sort(key=lambda x: x[ID])

    return prescriptions

# SEND NEW MESSAGE
def send_new_message(message):
    global current_message_id
    try:
        messages.insert_one(message.to_dict())
        current_message_id += 1
    except Exception as e:
        print(e)

def get_messages_with(email, collection):
    print(email)
    messages = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find({ "receiver": email } )]
    messages.sort(key=lambda x: x[TIME])

    return messages


def get_last_by_collection(collection, num=None):
    l = [{k: v for k, v in c.items() if (k != '_id' and k != 'id')} for c in collection.find()]
    l.sort(key=lambda x: x[TIME])

    for it in l:
        del it[TIME]

    return l if num is None else l[-1: -min(int(num), len(l)) - 1: -1]

def get_last_week_checkpoins_by_type(type, collection):
    day_names = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']
    today = datetime(datetime.now().year, datetime.now().month, datetime.now().day) + timedelta(days=1)
    l = []
    print([c for c in collection.find()][-3:-1])
    if collection == checkpoints:
        l = [c[TIME] for c in collection.find({TYPE: type}) if timedelta(days=0) < today - c[TIME] < timedelta(days=7)]
    else:
        l = [c[TIME] for c in collection.find() if timedelta(days=0) < today - c[TIME] < timedelta(days=7)]
    l = [day_names[day.weekday()] for day in l]
    count = {day: 0 for day in day_names}
    for el in l:
        count[el] += 1
    for _ in range(today.weekday()):
        day_names.append(day_names.pop(0))
    
    result = [{day: count[day]} for day in day_names]

    return result
