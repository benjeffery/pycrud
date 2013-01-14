import re

def num_words(string):
    return len(re.findall(r'\w+', string))
def num_lines(string):
    return len(string.splitlines())
problem_defs = {
    'studies': {
        'Title has few words':             lambda s: num_words(s['title']) < 3,
        'Title has many words':            lambda s: num_words(s['title']) < 10,
        'Title has more than one line':    lambda s: num_lines(s['title']) > 1,

        'Has no contact persons':          lambda s: len(s['contact_persons']) == 0,
        'Has too many contact persons':    lambda s: len(s['contact_persons']) > 3,

        'Has no people':                   lambda s: len(s['people']) == 0,

        'Description too short':           lambda s: num_words(s['description']) < 20,
        'Description too long':            lambda s: num_words(s['description']) > 150,
    },

    'contact_persons': {
        'No email':               lambda p:len(p['email']) == 0,
        'No affiliations':        lambda p:len(p['affiliations']) == 0,
        'Description too short':  lambda p: num_words(p['description']) < 20,
        'Description too long':   lambda p: num_words(p['description']) > 150,

    }
}

def list_problems(db):
    found_problems = {}
    for collection_name, problems in problem_defs.items():
        for problem, is_a_problem in problems.items():
            entities = []
            for entity in db[collection_name].find():
                if is_a_problem(entity):
                    entities.append({'_id': str(entity['_id']),
                                     'name': entity['name']
                    })
            found_problems.setdefault(collection_name, []).append({'problem':problem,
                                                                   'entities': entities})
    print found_problems
    return found_problems




