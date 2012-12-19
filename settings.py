from link import Link
from datatypes import Object, Text, Markdown, MongoLink, List, Boolean, Email, URL, Location, Image

secret = 'SECRET HERE'

db = {'host': 'localhost',
      'database': 'test'}

userlist = {'ben.jeffery@well.ox.ac.uk',
            'pvaut@well.ox.ac.uk'
            }

data_spec = {
    'studies': {
        'short_code': Text(),
        'name': Text(),
        'description': Markdown(),
        'corresponding_member': MongoLink('corresponding_members'),
        'people': List(Text()),
        'sample_contexts':List(
                Object({
                    'name': Text(),
                    'description': Markdown(),
                    'location': Location(),
                    'samples': List(
                        Object({
                            'ox_code': Text(),
                            'duplicated': Boolean(),
                            'lab_sample': Boolean()
                            })
                    )
                })
        )
    },
    'contact_persons': {
        'name': Text(),
        'email': Email,
        'http': URL(),
        'description': Markdown,
        'affiliations': List(Text()),
        'image': Image()
    }
}

#data_prototypes = {
#    'study':{
#        'short_code': 'PFXX',
#        'name': 'A study',
#        'description': 'Some text',
#        #        'pi': Link('pi'),
#        'people': ['Bob',],
#        'sample_contexts':[
#            {
#                'name': 'A context',
#                'description': 'Some text',
#                'locations': ['Oxford',],
#                'samples': [
#                    {
#                        'ox_code': 'AAAAA',
#                        'duplicated': False,
#                        'lab_sample': False
#                    },
#                    ]
#            },
#            ],
#        },
##    'pi':{
##        'name': 'Bob McMalaria',
##        'email': 'bob@malaria.com',
##        'http': 'http://malaria.com/bob',
##        'description': 'Some text',
##        'affiliations': ['Leonard Stanley Primary School',],
##        'image': 'Base64URL'
##    }
##}

#a = {
#    'short_code': 'PFXX',
#    'name': 'Genome variation & signatures of Plasmodium falciparum population structure',
#    'description': "In Burkina Faso, Jean Bosco Ouedraogo and colleagues worked with Susana Campino and Sarah Auburn in the MalariaGEN team to collect samples from three urban clinics in Bobo-Dioulasso (Colsama, Ouezzin-ville and Sakaby), each up to 8km from the IRSS laboratory.    Samples were used to develop field-friendly leukocyte depletion methods, GoldenGate genotyping assay development, and to contribute to our global Plasmodium falciparum genome variation data analysis. Jean Bosco and team are keen to investigate signatures of population structure and other unique features of genome variation between the 3 locations from which samples were collected and around the country.",
#    'contact_person' : {
#        'name': "Mick McMalaria",
#        'id': '1234567890',
#    },
#    'people': ['Bob',
#               'Bill',
#               'Dave',
#               'Paul',
#               'Frank'],
#    'sample_contexts':[
#        {
#            'name': 'Bobo-Dioulasso',
#            'description': 'Samples from three urban clinics in Bobo-Dioulasso (Colsama, Ouezzin-ville and Sakaby), each up to 8km from the IRSS laboratory.',
#            'location': 'Bobo-Dioulasso',
#            'samples': [
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },{
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#                {
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },{
#                    'ox_code': 'AAAAA',
#                    'duplicated': false,
#                    'lab_sample': false
#                },
#
#                ]
#        },
#        ],
#    }