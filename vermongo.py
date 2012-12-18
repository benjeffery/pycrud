#https://github.com/thiloplanz/v7files/wiki/Vermongo
#https://github.com/thiloplanz/v7files/blob/master/src/main/java/v7db/files/mongodb/Vermongo.java
import pymongo
from pymongo import MongoClient

class ObjDoesNotExistException(Exception):
    pass

class UpdateConflictException(Exception):
    #TODO Could contain conflicting versions
    pass

class VerCollection:
    def __init__(self, collection):
        self.__dict__['collection'] = collection
        self.__dict__['shadow_collection'] = collection.database.vermongo
    def insert(self, obj):
        if '_version' in obj:
            raise ValueError('_version cannot be in obj')
        obj['_version'] = 1
        return self.collection.insert(obj)

    def update(self, obj):
        if '_version' not in obj:
            raise ValueError('no _version in obj so cannot update')
        base_obj = self.collection.find_one({'_id':obj['_id']})
        if base_obj is None:
            print obj
            raise ObjDoesNotExistException()
        if base_obj == obj:
            return
        if base_obj['_version'] != obj['_version']:
            raise UpdateConflictException()
        base_obj['_id'] = {'_id': base_obj['_id'], '_version': base_obj['_version']}
        self.shadow_collection.insert(base_obj)
        #TODO Last line should not error if shadow already exists
        try:
            obj['_version'] += 1
            found = self.collection.find_and_modify({'_id':obj['_id'], '_version':obj['_version']-1}, obj)
            if found is None:
                #Means the obj changed while we were preparing things or got deleted
                base_obj = self.collection.find_one({'_id':obj['_id']})
                if base_obj is None:
                    raise ObjDoesNotExistException()
                else:
                    raise UpdateConflictException()
        except Exception as e:
            obj['_version'] -= 1
            raise e
        return self.collection.find_one({'_id':obj['_id']})

    def __getattr__(self, attr):
        return getattr(self.collection, attr)
    def __setattr__(self, attr, value):
        return setattr(self.collection, attr, value)



if __name__ == '__main__':
    connection = MongoClient('localhost', 27017)
    db = connection.test_database
    collection = db.test_collection
    collection.drop()
    db.vermongo.drop()

    ver_coll = VerCollection(collection)
    bob = {'bill' :5,
           'wtf': 'foobar',
           'doc': {'a':1}}
    ver_coll.insert(bob)

    import pprint
    b = ver_coll.find_one()
    b['ben'] = True
    ver_coll.update(b)
    b['claire'] = 'yay'
    ver_coll.update(b)
    b['claire'] = 'yayay'
    b['ben'] = False
    ver_coll.update(b)

    print list(collection.find())
    pprint.pprint(list(db.vermongo.find()))



#  coll.insert(obj)
#  coll.find (stays the same)
#  coll.update(single)