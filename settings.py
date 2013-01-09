from link import Link
from datatypes import Object, Text, Markdown, MongoLink, List, Boolean, Email, URL, Location, Image

secret = 'SECRET HERE'

db = {'host': 'localhost',
      'database': 'test'}

userlist = {'ben.jeffery@well.ox.ac.uk',
            'pvaut@well.ox.ac.uk'
            }

data_spec = {
    'studies': {},
    'contact_persons': {},
    'locations': {}
}