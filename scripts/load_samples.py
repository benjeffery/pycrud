import csv
import json
import pymongo
from pymongo import MongoClient

connection = MongoClient('localhost', 27017)
db = connection.test
studies = db.studies
locations = db.locations

class Reader:
    def __init__(self, file):
        print file
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
paul_id_to_db_id = {}
for line in Reader('SitesInfo.txt'):
    paul_id_to_desc[line['ID']] = line['Name']
    location = locations.find_one({'paul_id':line['ID']})
    if location:
        paul_id_to_db_id[line['ID']]  = location['_id']
    if location is None:
        location = {
            'paul_id': line['ID'],
            'name': ' '.join(line['ID'].split('_')[1:]),
            'lat': line['Location1'],
            'long': line['Loc2'],
            'country': line['Country'],
            'sub-continent': line['SubCont'],
            }
        paul_id_to_db_id[line['ID']]  = locations.save(location)


for line in Reader('metadata-2.0.2_withsites.txt'):
    #First get the study object
    study = studies.find_one({'short_code':line['Study']})
    if study is None:
        study = {'short_code': line['Study'], 'sample_contexts':[]}
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
                          'description': paul_id_to_desc.get(sample_context_name,None),
                          'location': paul_id_to_db_id.get(sample_context_name, None),
                          'samples':[]}
        study['sample_contexts'].append(sample_context)
    sample_context['samples'].append({
        'ox_code':line['Sample'],
        'excluded':line['Exclude']=='TRUE',
        'year': line['Year'],
        'info_source': line['SiteInfoSource']
    })
    studies.save(study)

af = json.load(open('alfresco121218.json'))
for study in studies.find():
    try:
        af_study = next(s for s in af['collaborationNodes'] if study['short_code'] in s['title'])

    except StopIteration:
        print "No AF study for", study['short_code']
        continue
    study['name'] = af_study['title'].split(' - ')[-1]
    study['description'] = af_study['description']
    studies.save(study)



