import os
from flask import *
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template
file_path = os.path.abspath(os.getcwd())+"\database.db"
 

app = Flask(__name__, template_folder='templates', static_folder='staticfiles')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+file_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
db.init_app(app)
cors = CORS()
cors.init_app(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

class ContactModel(db.Model):
    __tablename__ = "table"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True)
    email = db.Column(db.String(), unique=False)
    phone = db.Column(db.String(), unique=True)
    postalcode = db.Column(db.String(), unique=False)

    def __init__(self, name, email, phone, postalcode):
        self.name = name
        self.email = email
        self.phone = phone
        self.postalcode = postalcode

    def __repr__(self):
        return f"{self.name}"

@app.before_first_request
def create_table():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data/create' , methods = ['GET','POST'])
def create():
    if request.method == 'GET':
        return jsonify({"success": True, "message": "this is the create endpoint"}), 201
 
    if request.method == 'POST':
        request_data = json.loads(request.data)
        name = request_data['name']
        email = request_data['email']
        phone = request_data['phone']
        postalcode = request_data['postalcode']
        contact = ContactModel(
            name=name,
            email=email,
            phone=phone,
            postalcode=postalcode
        )
        db.session.add(contact)
        db.session.commit()
        return jsonify({"success": True, "message": "contact added successfully"}), 201

def contact_serializer(contact): 
    return {'id': contact.id, 'name': contact.name, 'email': contact.email, 'phone': contact.phone, 'postalcode': contact.postalcode}

@app.route('/data')
def retrieveDataList():
    return jsonify([*map(contact_serializer, ContactModel.query.all())])


@app.route('/data/delete', methods=['GET','POST'])
def delete():
    request_data = json.loads(request.data)
    name = request_data['name']
    contact = ContactModel.query.filter_by(name=name).first()
    if request.method == 'POST':
        if contact:
            db.session.delete(contact)
            db.session.commit()
            return jsonify({"success": True, "message": "Contact deleted successfully"}), 201
        abort(404)
 
    return jsonify({"success": True}), 201

@app.route('/data/update', methods=['POST'])
def update_contact():
    old_name = request.json.get('oldName')
    new_name = request.json.get('newName')
    old_email = request.json.get('oldEmail')
    new_email = request.json.get('newEmail')
    old_phone = request.json.get('oldPhone')
    new_phone = request.json.get('newPhone')
    old_postal_code = request.json.get('oldPostalCode')
    new_postal_code = request.json.get('newPostalCode')


    contact = ContactModel.query.filter_by(name=old_name, email=old_email, phone=old_phone, postalcode=old_postal_code).first()
    if contact:
        contact.name = new_name
        contact.email = new_email
        contact.phone = new_phone
        contact.postalcode = new_postal_code
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Contact not found'})

if __name__ == '__main__':
    app.run(debug=True)
