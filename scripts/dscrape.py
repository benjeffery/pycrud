import requests
from bs4 import BeautifulSoup
import difflib
from fuzzywuzzy import process
import fuzzywuzzy.fuzz
from fuzzywuzzy.fuzz import token_set_ratio

soup = BeautifulSoup(requests.get("http://www.malariagen.net/community/people/A-Z").text)
people = []
for li in soup.find(class_ = "investigator_profile").find_all('li'):
    #print dir(li)
    #print list(li.strings)
    try:
        p = {'name': li.a.string.strip(),
             'link': li.a['href'],
             'country': list(li.strings)[-1].strip()
        }
    except AttributeError: #Some people don't have a link :(
        p = {'name': list(li.strings)[0].strip(),
             'country': list(li.strings)[-1].strip()
        }
    people.append(p)
print "People index loaded"

def info_for_name(name):
    names = [p['name'] for p in people]
    match = process.extractOne(name, names, scorer=token_set_ratio, score_cutoff=75)
    if not match:
        return None
    person = (p for p in people if p['name'] == match[0]).next()
    soup = BeautifulSoup(requests.get("http://www.malariagen.net/"+person['link']).text)
    content = soup.find(class_ = "content_middle")
    ret = {}
    try:
        ret['image'] = 'http://www.malariagen.net/'+content.find(class_ = 'imagefloat').img['src']
    except AttributeError:
        ret['image'] = None
    ret['institutes'] =  [t.string for t in content.find_all('h4')]
    ret['bio'] =  '\n'.join([str(t) for t in content.find_all('p') if t])
    return ret