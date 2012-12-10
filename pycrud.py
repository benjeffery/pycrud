from flask import Flask, render_template, session
from flask.ext.login import LoginManager,  UserMixin, current_user, abort
from flask.ext.browserid import BrowserID
import settings
import pymongo
from bson.objectid import ObjectId
import inflect
inflect = inflect.engine()

connection = pymongo.MongoClient(settings.db['host'], 27017)
db = connection[settings.db['database']]
settings.data_prototypes = dict((inflect.plural(k), v) for k,v in settings.data_prototypes.items())

#FLASK INIT
class User(UserMixin):
    def __init__(self, id):
        self.id = id

def get_user_by_id(id):
    if id in settings.userlist:
        return User(id)
    #TODO Proper noauth error

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
    return render_template('index.html', collections=settings.data_prototypes.keys())

@app.route('/collection/<collection>/')
def collection_index(collection):
    return render_template('collection_index.html', collection=collection, entries=db[collection].find())

@app.route('/object/<collection>/<id>')
def object(collection, id):
    object = db[collection].find_one({'_id':ObjectId(id)})
    if object is None:
        abort(404)
    del object['_id']
    return render_template('object.html', collection=collection, object=object)


if __name__ == '__main__':
    app.run(debug=True)

#EACH OF THESE NEEDS TO OUT PUT THE HTML TO RENDER IT.... UNLESS WE DO THAT IN JS??!?
    #class Object(object):
    #    pass
    #class Text(object):
    #    pass
    #class Markdown(object):
    #    pass
    #class List(object):
    #    pass
    #class Boolean(object):
    #    pass
    #class MongoLink(object):
    #    pass
    #class Email(object):
    #    pass
    #class HttpLink(object):
    #    pass
    #class Location(object):
    #    pass
    #class Image(object):
    #    pass