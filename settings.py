from link import Link
#from types import Object, Text, Markdown, MongoLink, List, Boolean, Email, HttpLink

secret = 'SECRET HERE'

db = {'host': 'localhost',
      'database': 'test'}

userlist = {'ben.jeffery@well.ox.ac.uk',
            'pvaut@well.ox.ac.uk'}

#data_prototypes = {
#    'study': Object({
#        'short_code': Text(),
#        'name': Text(),
#        'description': Markdown(),
#        'pi': MongoLink('pi'),
#        'people': List(Text()),
#        'sample_contexts':List(
#                Object({
#                    'name': Text(),
#                    'description': Markdown(),
#                    'locations': List(Location()),
#                    'samples': List(
#                        Object({
#                            'ox_code': Text(),
#                            'duplicated': Boolean(),
#                            'lab_sample': Boolean()
#                            })
#                    )
#                })
#        )
#    }),
#    'pi': Object({
#        'name': Text(),
#        'email': Email,
#        'http': HttpLink(),
#        'description': Markdown,
#        'affiliations': List(Text()),
#        'image': Image()
#    })
#}

data_prototypes = {
    'study':{
        'short_code': 'PFXX',
        'name': 'A study',
        'description': 'Some text',
        #        'pi': Link('pi'),
        'people': ['Bob',],
        'sample_contexts':[
            {
                'name': 'A context',
                'description': 'Some text',
                'locations': ['Oxford',],
                'samples': [
                    {
                        'ox_code': 'AAAAA',
                        'duplicated': False,
                        'lab_sample': False
                    },
                    ]
            },
            ],
        },
    'pi':{
        'name': 'Bob McMalaria',
        'email': 'bob@malaria.com',
        'http': 'http://malaria.com/bob',
        'description': 'Some text',
        'affiliations': ['Leonard Stanley Primary School',],
        'image': 'Base64URL'
    }
}