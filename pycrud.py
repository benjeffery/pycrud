import datetime
from flask import Flask, render_template, session, Response, request
from flask.ext.login import LoginManager,  UserMixin, current_user, abort, login_required
from flask.ext.browserid import BrowserID
from flask.views import MethodView
import settings
import pymongo
from bson.objectid import ObjectId
import json

import inflect

#MONGO INIT
from vermongo import VerCollection
connection = pymongo.MongoClient(settings.db['host'], 27017)
db = connection[settings.db['database']]

#FLASK INIT
class User(UserMixin):
    def __init__(self, id):
        self.id = id

def get_user_by_id(id):
    if id in settings.userlist:
        return User(id)

def get_user(browser_id):
    return get_user_by_id(browser_id['email'])

app = Flask(__name__)
app.secret_key = settings.secret

login_manager = LoginManager()
login_manager.user_loader(get_user_by_id)
login_manager.init_app(app)

browser_id = BrowserID()
browser_id.user_loader(get_user)
browser_id.init_app(app)

@app.route('/')
def index_page():
    return render_template('index.html', collections=settings.data_spec.keys())

#JSON
class MongoEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.datetime):
            return o.isoformat()
        elif isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def jsonify(data):
    return Response(json.dumps(data, cls=MongoEncoder), mimetype='application/json')

class MongoAPI(MethodView):
    def get(self, collection, item_id):
        if collection is None:
            return jsonify([{'name':name} for name in settings.data_spec.keys()])
        if item_id is None:
            return jsonify(list(db[collection].find()))
        else:
            print collection
            return jsonify(data=db[collection].find_one({"_id": ObjectId(item_id)}))
    def post(self, collection):
        result = VerCollection(db[collection]).insert(request.json)
        return jsonify(result)
#Need vermongo impl
#    def delete(self, collection, item_id):
#        collection.remove({"_id": ObjectId(item_id)})
#        return ""
    def put(self, collection, item_id):
        assert (item_id == request.json['_id'])
        request.json['_id'] = ObjectId(item_id)
        result = VerCollection(db[collection]).update(request.json)
        return jsonify(result)

mongo_view = login_required(MongoAPI.as_view('mongo'))
app.add_url_rule('/api/', defaults={'collection': None, 'item_id': None},
    view_func=mongo_view, methods=['GET',])
app.add_url_rule('/api/<collection>/', defaults={'item_id': None},
    view_func=mongo_view, methods=['GET',])
app.add_url_rule('/api/<collection>/', view_func=mongo_view, methods=['POST',])
app.add_url_rule('/api/<collection>/<item_id>', view_func=mongo_view,
    methods=['GET', 'PUT', 'DELETE'])


if __name__ == '__main__':
    app.run(debug=True)
