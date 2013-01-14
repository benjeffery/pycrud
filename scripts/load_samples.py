import csv
import json
import pymongo
from pymongo import MongoClient

connection = MongoClient('localhost', 27017)
db = connection.test
studies = db.studies
#locations = db.locations
contact_persons = db.contact_persons

class Reader:
    def __init__(self, file):
        self.file = open(file, 'r')
        dialect = csv.Sniffer().sniff(self.file.read(2048*4))
        self.file.seek(0)
        reader = csv.reader(self.file, dialect)
        #Read a line so we get the fieldnames loaded
        self.field_names = next(reader)
        names = []
        for name in self.field_names:
            names.append(name.split('#')[0])
        self.field_names = names
        self.reader = csv.reader(self.file, dialect)
    def fieldnames(self):
        return self.field_names
    def __iter__(self):
        return self
    def next(self):
        return dict(zip(self.field_names,next(self.reader)))
    def __del__(self):
        self.file.close()

paul_id_to_desc = {}
paul_id_to_location = {}
for line in Reader('SitesInfo.txt'):
    paul_id_to_desc[line['ID']] = line['Name']
    location = None #locations.find_one({'paul_id':line['ID']})
    #if location:
    #    paul_id_to_db_id[line['ID']]  = location['_id']
    #if location is None:
    location = {
        'paul_id': line['ID'],
        'name': ' '.join(line['ID'].split('_')[1:]),
        'lat': line['Location1'],
        'lon': line['Loc2'],
        'country': line['Country'],
        'sub-continent': line['SubCont'],
        '_version':1
        }
    #paul_id_to_db_id[line['ID']]  = locations.save(location)
    paul_id_to_location[line['ID']]  = location

for line in Reader('metadata-2.0.2_withsites.txt'):
    #First get the study object
    study = studies.find_one({'legacy_name':line['Study']})
    if study is None:
        study = {'legacy_name': line['Study'], 'sample_contexts':[], 'people':[], 'contact_persons':[], '_version':1}
    sample_context_name = line['Site']
    if not sample_context_name and line['LabSample']=='TRUE':
        sample_context_name = 'LAB_Lab_Sample'
    if not sample_context_name:
        sample_context_name = '??_Unknown'
    try:
        sample_context = next(sc for sc in study['sample_contexts'] if sc['paul_id']==sample_context_name)
    except StopIteration:
        sample_context = {'name':' '.join(sample_context_name.split('_')[1:]),
                          'paul_id':sample_context_name,
                          'description': paul_id_to_desc.get(sample_context_name,''),
                          'location': paul_id_to_location.get(sample_context_name, {}),
                          'samples':[],
                          'info_source': ''}
        study['sample_contexts'].append(sample_context)
    if line['SiteInfoSource'] not in sample_context['info_source']:
        if sample_context['info_source']:
            sample_context['info_source'] = sample_context['info_source'] + ', ' + line['SiteInfoSource']
        else:
            sample_context['info_source'] = line['SiteInfoSource']
    sample_context['samples'].append({
        'ox_code':line['Sample'],
        'excluded':line['Exclude']=='TRUE',
        'year': line['Year'],
    })
    studies.save(study)

af = json.load(open('alfresco121218.json'))
for study in studies.find():
    try:
        af_study = next(s for s in af['collaborationNodes'] if study['legacy_name'] in s['title'])
    except StopIteration:
        print "No AF study for", study['legacy_name']
        continue
    study['title'] = af_study['title'].split(' - ')[-1]
    study['name'] = af_study['name']
    study['description'] = af_study['description']
    for contact in af_study['contacts']:
        name = ' '.join([contact['firstName'],contact['lastName']])
        #Some have no email so have to use name for unique key for now....
        db_contact = contact_persons.find_one({'name':name})
        if db_contact:
            study['contact_persons'].append({'_id':db_contact['_id'], 'name':db_contact['name']})
        else:
            db_contact = {'name': name,
                          'email': contact['email'],
                          'affiliations': [contact['company'],],
                          'description': '',
                          '_version': 1
                          }
            study['contact_persons'].append({'_id':contact_persons.save(db_contact), 'name':name})
    studies.save(study)



