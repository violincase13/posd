from pydantic import BaseModel
from pydantic_mongo import AbstractRepository, ObjectIdField
from datetime import datetime

FIRSTNAME = 'firstName'
LASTNAME = 'lastName'
USERNAME = 'username'
EMAIL = 'email'
PASSWORD = 'password'
ROLE = 'role'

SENDER = 'sender'
RECEIVER = 'receiver'
TEXT = 'text'

HEMOGRAM = 'hemogram'
UREA = 'urea'
CREATINE = 'creatine'
ALT = 'ALT'
AST = 'AST'
ASSIGNEDTO = 'assignedTo'

DESCRIPTION = 'description'

ID = 'id'
MONGO_ID = '_id'
URL = 'url'
USER = 'user'
PATIENT = 'patient'
DOCTOR = 'doctor'
TIME = 'time'

# USERS REPOSITORY
class Users(BaseModel):
    id: int
    firstName: str
    lastName: str
    username: str
    email: str
    password: str
    role: str

    @staticmethod
    def validate(user):
        if user.get(FIRSTNAME) is None or user.get(LASTNAME) is None or user.get(USERNAME) is None or \
                user[EMAIL] is None or user.get(PASSWORD) is None or user.get(ROLE) is None:
            return False
        return True

    @staticmethod
    def init_from_dict(user):
        return Users(
                id = user.get(ID, 0),
                firstName = user[FIRSTNAME],
                lastName = user[LASTNAME],
                username = user[USERNAME],
                email = user[EMAIL],
                password = user[PASSWORD],
                role = user[ROLE]
            )

    def to_dict(self):
        user_dict = {
            ID: self.id,
            FIRSTNAME: self.firstName,
            LASTNAME: self.lastName,
            USERNAME: self.username,
            EMAIL: self.email,
            PASSWORD: self.password,
            ROLE: self.role
        }
        return user_dict
    
    def to_nice_dict(self):
        user_dict = {
            FIRSTNAME: self.firstName,
            LASTNAME: self.lastName,
            EMAIL: self.email,
            ROLE: self.role
        }
        return user_dict


# PATIENTS REPOSITORY
class Patients(BaseModel):
    id: int
    firstName: str
    lastName: str
    username: str
    email: str
    password: str
    role: str

    @staticmethod
    def validate(patient):
        if patient.get(FIRSTNAME) is None or patient.get(LASTNAME) is None or patient.get(USERNAME) is None or \
                patient[EMAIL] is None or patient.get(PASSWORD) is None or patient.get(ROLE) is None:
            return False
        return True

    @staticmethod
    def init_from_dict(patient):
        return Patients(
                id = patient.get(ID, 0),
                firstName = patient[FIRSTNAME],
                lastName = patient[LASTNAME],
                username = patient[USERNAME],
                email = patient[EMAIL],
                password = patient[PASSWORD],
                role = patient[ROLE]
            )

    def to_dict(self):
        patient_dict = {
            ID: self.id,
            FIRSTNAME: self.firstName,
            LASTNAME: self.lastName,
            USERNAME: self.username,
            EMAIL: self.email,
            PASSWORD: self.password,
            ROLE: self.role
        }
        return patient_dict
    
    def to_nice_dict(self):
        patient_dict = {
            FIRSTNAME: self.firstName,
            LASTNAME: self.lastName,
            EMAIL: self.email,
            ROLE: self.role
        }
        return patient_dict


class PatientsRepository(AbstractRepository[Patients]):
    class Meta:
        collection_name = 'patients'



# DOCTORS REPOSITORY
class Doctors(BaseModel):
    id: int
    firstName: str
    lastName: str
    username: str
    email: str
    password: str
    role: str

    @staticmethod
    def validate(doctor):
        if doctor.get(FIRSTNAME) is None or doctor.get(LASTNAME) is None or doctor.get(USERNAME) is None or \
                doctor[EMAIL] is None or doctor.get(PASSWORD) is None or doctor.get(ROLE) is None:
            return False
        return True

    @staticmethod
    def init_from_dict(doctor):
        return Doctors(
                id = doctor.get(ID, 0),
                firstName = doctor[FIRSTNAME],
                lastName = doctor[LASTNAME],
                username = doctor[USERNAME],
                email = doctor[EMAIL],
                password = doctor[PASSWORD],
                role = doctor[ROLE]
            )

    def to_dict(self):
        doctor_dict = {
            ID: self.id,
            FIRSTNAME: self.firstName,
            LASTNAME: self.lastName,
            USERNAME: self.username,
            EMAIL: self.email,
            PASSWORD: self.password,
            ROLE: self.role
        }
        return doctor_dict
    
    def to_nice_dict(self):
        doctor_dict = {
            FIRSTNAME: self.firstName,
            LASTNAME: self.lastName,
            EMAIL: self.email,
            ROLE: self.role
        }
        return doctor_dict


class DoctorsRepository(AbstractRepository[Doctors]):
    class Meta:
        collection_name = 'doctors'


# MESSAGES REPOSITORY
class Messages(BaseModel):
    id: int
    sender: str
    receiver: str
    text: str
    time: datetime

    @staticmethod
    def validate(message):
        if message.get(SENDER) is None or message.get(RECEIVER) is None:
            return False
        return True

    @staticmethod
    def init_from_dict(message):
        return Messages(
                id = message.get(ID, 0),
                sender = message[SENDER],
                receiver = message[RECEIVER],
                text = message[TEXT],
                time = message.get(TIME, datetime.now())
            )

    def to_dict(self):
        message_dict = {
            ID: self.id,
            SENDER: self.sender,
            RECEIVER: self.receiver,
            TEXT: self.text,
            TIME: self.time
        }
        return message_dict

    def to_nice_dict(self):
        message_dict = {
            SENDER: self.sender,
            RECEIVER: self.receiver,
            TEXT: self.text
        }
        return message_dict


class MessagesRepository(AbstractRepository[Messages]):
    class Meta:
        collection_name = 'messages'



# MEDICAL RECORDS REPOSITORY
class MedicalRecords(BaseModel):
    id: int
    date: datetime
    hemogram: int
    urea: int
    creatine: float
    ALT: int
    AST: int
    assignedTo: str

    @staticmethod
    def validate(medicalRecord):
        if medicalRecord.get(HEMOGRAM) is None or medicalRecord.get(UREA) is None \
            or medicalRecord.get(CREATINE) is None or medicalRecord.get(ALT) is None or medicalRecord.get(AST) is None:
            return False
        return True

    @staticmethod
    def init_from_dict(medicalRecord):
        return MedicalRecords(
                date = medicalRecord.get(ID, 0),
                hemogram = medicalRecord[HEMOGRAM],
                urea = medicalRecord[UREA],
                creatine = medicalRecord[CREATINE],
                ALT = medicalRecord[ALT],
                AST = medicalRecord[AST],
                assignedTo = medicalRecord[ASSIGNEDTO]
            )

    def to_dict(self):
        medical_record_dict = {
            ID: self.id,
            HEMOGRAM: self.hemogram,
            UREA: self.urea,
            CREATINE: self.creatine,
            ALT: self.ALT,
            AST: self.AST,
            ASSIGNEDTO: self.assignedTo
        }
        return medical_record_dict

    def to_nice_dict(self):
        medical_record_dict = {
            ID: self.id,
            HEMOGRAM: self.hemogram,
            UREA: self.urea,
            CREATINE: self.creatine,
            ALT: self.ALT,
            AST: self.AST,
            ASSIGNEDTO: self.assignedTo
        }
        return medical_record_dict


class MedicalRecords(AbstractRepository[MedicalRecords]):
    class Meta:
        collection_name = 'medical_records'

# PRESCRIPTIONS REPOSITORY
class Prescriptions(BaseModel):
    id: int
    description: str
    assignedTo: str

    @staticmethod
    def validate(prescription):
        if prescription.get(DESCRIPTION) is None or prescription.get(ASSIGNEDTO) is None:
            return False
        return True

    @staticmethod
    def init_from_dict(prescription):
        return Prescriptions(
                date = prescription.get(ID, 0),
                description = prescription[DESCRIPTION],
                assignedTo = medicalRecord[ASSIGNEDTO]
            )

    def to_dict(self):
        prescription_dict = {
            ID: self.id,
            DESCRIPTION: self.description,
            ASSIGNEDTO: self.assignedTo
        }
        return prescription_dict

    def to_nice_dict(self):
        prescription_dict = {
            ID: self.id,
            DESCRIPTION: self.description,
            ASSIGNEDTO: self.assignedTo
        }
        return prescription_dict


class Prescriptions(AbstractRepository[Prescriptions]):
    class Meta:
        collection_name = 'prescriptions'


if __name__ == '__main__':
    new_user = {
        ID: 1,
        FIRSTNAME: 'Jane',
        LASTNAME: 'Doe',
        USERNAME: 'janeDoe',
        EMAIL: 'janeDoe@gmail.com',
        PASSWORD: 'janeDoePassword',
        ROLE: 'patient'
    }
    user = Users(
        id=new_user[ID], 
        firstName = new_user['firstName'],
        lastName = new_user['lastName'],
        username = new_user['username'],
        email = new_user['email'],
        password = new_user['password'],
        role = new_user['role']

    )
    print(dir(user))
    print(user.to_dict())
